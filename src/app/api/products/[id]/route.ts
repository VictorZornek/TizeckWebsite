import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectMongo } from "@/database/db";
import Products from "@/database/models/Product";
import AWS from "aws-sdk";
import { updateProductSchema, objectIdSchema } from "@/lib/validators/product";
import { sanitizePathName } from "@/lib/validators/common";

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
    const bodyResult = updateProductSchema.safeParse(body);
    if (!bodyResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }
    const validatedData = bodyResult.data;
    
    await connectMongo();
    
    const oldProduct = await Products.findById(validatedId);
    
    if (!oldProduct) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }
    
    const oldName = oldProduct.name;
    const oldCategory = oldProduct.category;
    const nameChanged = oldName !== validatedData.name;
    const categoryChanged = oldCategory !== validatedData.category;
    
    // Se nome ou categoria mudaram, precisamos mover a pasta no S3
    if (nameChanged || categoryChanged) {
      try {
        const oldSanitized = sanitizePathName(oldName);
        const newSanitized = sanitizePathName(validatedData.name);
        
        const oldPrefix = `${oldCategory}/${oldSanitized}/`;
        const newPrefix = `${validatedData.category}/${newSanitized}/`;
        
        // Listar todos os objetos da pasta antiga
        const listParams = {
          Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
          Prefix: oldPrefix,
        };
        
        const listedObjects = await s3.listObjectsV2(listParams).promise();
        
        if (listedObjects.Contents && listedObjects.Contents.length > 0) {
          // Copiar cada objeto para o novo caminho
          for (const obj of listedObjects.Contents) {
            const oldKey = obj.Key!;
            const fileName = oldKey.replace(oldPrefix, '');
            const newKey = `${newPrefix}${fileName}`;
            
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
          console.log(`✓ Pasta antiga deletada: ${oldPrefix}`);
          
          // Atualizar URLs das imagens
          const updatedImages = validatedData.images.map((img: string) => 
            img.replace(oldPrefix, newPrefix)
          );
          
          const product = await Products.findByIdAndUpdate(
            validatedId,
            { 
              name: validatedData.name,
              description: validatedData.description,
              category: validatedData.category,
              images: updatedImages,
              specifications: validatedData.specifications,
              activated: validatedData.activated,
              featured: validatedData.featured,
            },
            { new: true }
          );
          
          // Revalidar home, categorias e detalhes
          revalidatePath("/");
          revalidatePath(`/products/${encodeURIComponent(oldCategory)}`);
          revalidatePath(`/products/${encodeURIComponent(validatedData.category)}`);
          revalidatePath(`/details/${encodeURIComponent(oldName)}`);
          revalidatePath(`/details/${encodeURIComponent(validatedData.name)}`);
          
          return NextResponse.json(product);
        }
      } catch (error) {
        console.error("Erro ao mover pasta no S3:", error);
        return NextResponse.json({ 
          error: "Erro ao mover pasta do produto no S3" 
        }, { status: 500 });
      }
    }
    
    const product = await Products.findByIdAndUpdate(
      validatedId,
      { 
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        images: validatedData.images,
        specifications: validatedData.specifications,
        activated: validatedData.activated,
        featured: validatedData.featured,
      },
      { new: true }
    );
    
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }
    
    // Revalidar home, categoria e detalhes
    revalidatePath("/");
    revalidatePath(`/products/${encodeURIComponent(validatedData.category)}`);
    revalidatePath(`/details/${encodeURIComponent(validatedData.name)}`);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    
    await connectMongo();
    
    const product = await Products.findById(validatedId);
    
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Deletar imagens do S3 usando as URLs armazenadas
    const s3Errors: string[] = [];
    
    for (const imageUrl of product.images) {
      try {
        const url = new URL(imageUrl);
        const key = decodeURIComponent(url.pathname.substring(1));
        
        if (key) {
          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
            Key: key,
          }).promise();
          
          console.log(`✓ Imagem deletada do S3: ${key}`);
        }
      } catch (error) {
        const errorMsg = `Erro ao deletar imagem ${imageUrl}: ${error}`;
        console.error(errorMsg);
        s3Errors.push(errorMsg);
      }
    }
    
    // Se houver erros no S3, não deletar do banco
    if (s3Errors.length > 0) {
      console.error("Falha ao deletar imagens do S3. Abortando delete do produto.");
      return NextResponse.json({ 
        error: "Erro ao deletar imagens do S3",
        details: s3Errors 
      }, { status: 500 });
    }
    
    // Só deleta do banco se todas as imagens foram removidas do S3
    await Products.findByIdAndDelete(validatedId);
    
    console.log(`✓ Produto deletado do banco: ${product.name} (ID: ${validatedId})`);
    
    // Revalidar home, categoria e detalhes do produto deletado
    revalidatePath("/");
    revalidatePath(`/products/${encodeURIComponent(product.category)}`);
    revalidatePath(`/details/${encodeURIComponent(product.name)}`);
    
    return NextResponse.json({ 
      success: true,
      message: "Produto e imagens deletados com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
  }
}