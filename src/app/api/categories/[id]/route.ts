import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";
import Product from "@/database/models/Product";
import AWS from "aws-sdk";
import { updateCategorySchema } from "@/lib/validators/category";
import { objectIdSchema } from "@/lib/validators/product";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Validar ObjectId
    const idResult = objectIdSchema.safeParse(id);
    if (!idResult.success) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    const validatedId = idResult.data;
    
    const body = await request.json();
    
    // Validar body com Zod
    const bodyResult = updateCategorySchema.safeParse(body);
    if (!bodyResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }
    const validatedData = bodyResult.data;
    
    await connectMongo();
    
    const oldCategory = await Category.findById(validatedId);
    
    if (!oldCategory) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }
    
    const oldName = oldCategory.name;
    const nameChanged = oldName !== validatedData.name;
    
    // Se o nome mudou, precisamos renomear a pasta no S3 e atualizar produtos
    if (nameChanged) {
      try {
        // Listar todos os objetos da pasta antiga
        const listParams = {
          Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
          Prefix: `${oldName}/`,
        };
        
        const listedObjects = await s3.listObjectsV2(listParams).promise();
        
        if (listedObjects.Contents && listedObjects.Contents.length > 0) {
          // Copiar cada objeto para o novo caminho
          for (const obj of listedObjects.Contents) {
            const oldKey = obj.Key!;
            const newKey = oldKey.replace(`${oldName}/`, `${validatedData.name}/`);
            
            await s3.copyObject({
              Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
              CopySource: `${process.env.AWS_S3_BUCKET_PRODUCTS}/${oldKey}`,
              Key: newKey,
            }).promise();
            
            console.log(`✓ Copiado: ${oldKey} -> ${newKey}`);
          }
          
          // Deletar objetos antigos
          const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
            Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key: Key! })) },
          };
          
          await s3.deleteObjects(deleteParams).promise();
          console.log(`✓ Pasta antiga deletada: ${oldName}/`);
        }
        
        // Atualizar campo category em todos os produtos
        await Product.updateMany(
          { category: oldName },
          { $set: { category: validatedData.name } }
        );
        
        // Atualizar URLs das imagens nos produtos
        const products = await Product.find({ category: validatedData.name });
        for (const product of products) {
          const updatedImages = product.images.map((img: string) => 
            img.replace(`/${oldName}/`, `/${validatedData.name}/`)
          );
          await Product.findByIdAndUpdate(product._id, { images: updatedImages });
        }
        
        console.log(`✓ Produtos atualizados: ${oldName} -> ${validatedData.name}`);
      } catch (error) {
        console.error("Erro ao renomear pasta no S3:", error);
        return NextResponse.json({ 
          error: "Erro ao renomear categoria no S3" 
        }, { status: 500 });
      }
    }
    
    const category = await Category.findByIdAndUpdate(
      validatedId,
      { 
        name: validatedData.name,
        description: validatedData.description,
        image: validatedData.image,
        activated: validatedData.activated,
      },
      { new: true }
    );
    
    // Revalidar home
    revalidatePath("/");
    
    // Se nome mudou, revalidar páginas de produtos das categorias antiga e nova
    if (nameChanged) {
      revalidatePath(`/products/${encodeURIComponent(oldName)}`);
      revalidatePath(`/products/${encodeURIComponent(validatedData.name)}`);
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE() {
  return NextResponse.json(
    { 
      error: "Método não permitido. Use POST /api/categories/[id]/confirm-delete" 
    },
    { 
      status: 405,
      headers: {
        'Allow': 'GET, PUT'
      }
    }
  );
}