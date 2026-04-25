import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Category from "@/database/models/Category";
import Product from "@/database/models/Product";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, description, image, activated } = await request.json();
    
    await connectMongo();
    
    const oldCategory = await Category.findById(id);
    
    if (!oldCategory) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }
    
    const oldName = oldCategory.name;
    const nameChanged = oldName !== name;
    
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
            const newKey = oldKey.replace(`${oldName}/`, `${name}/`);
            
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
          { $set: { category: name } }
        );
        
        // Atualizar URLs das imagens nos produtos
        const products = await Product.find({ category: name });
        for (const product of products) {
          const updatedImages = product.images.map((img: string) => 
            img.replace(`/${oldName}/`, `/${name}/`)
          );
          await Product.findByIdAndUpdate(product._id, { images: updatedImages });
        }
        
        console.log(`✓ Produtos atualizados: ${oldName} -> ${name}`);
      } catch (error) {
        console.error("Erro ao renomear pasta no S3:", error);
        return NextResponse.json({ 
          error: "Erro ao renomear categoria no S3" 
        }, { status: 500 });
      }
    }
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, image, activated },
      { new: true }
    );
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectMongo();
    
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    const s3Errors: string[] = [];

    // 1. Deletar todos os produtos da categoria (pasta inteira no S3)
    try {
      const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
        Prefix: `${category.name}/`,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
          Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key: Key! })) },
        };

        await s3.deleteObjects(deleteParams).promise();
        console.log(`✓ Pasta de produtos deletada: ${category.name}/`);
      }
    } catch (error) {
      const errorMsg = `Erro ao deletar pasta de produtos: ${error}`;
      console.error(errorMsg);
      s3Errors.push(errorMsg);
    }

    // 2. Deletar imagem da categoria (em categories/)
    if (category.image) {
      try {
        const url = new URL(category.image);
        const key = decodeURIComponent(url.pathname.substring(1));
        
        if (key) {
          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_PRODUCTS!,
            Key: key,
          }).promise();
          
          console.log(`✓ Imagem da categoria deletada: ${key}`);
        }
      } catch (error) {
        const errorMsg = `Erro ao deletar imagem da categoria: ${error}`;
        console.error(errorMsg);
        s3Errors.push(errorMsg);
      }
    }
    
    // Se houver erros no S3, não deletar do banco
    if (s3Errors.length > 0) {
      console.error("Falha ao deletar arquivos do S3. Abortando delete da categoria.");
      return NextResponse.json({ 
        error: "Erro ao deletar arquivos do S3",
        details: s3Errors 
      }, { status: 500 });
    }

    // 3. Deletar produtos do banco
    await Product.deleteMany({ category: category.name });
    console.log(`✓ Produtos deletados do banco: categoria ${category.name}`);

    // 4. Deletar categoria do banco
    await Category.findByIdAndDelete(id);
    console.log(`✓ Categoria deletada do banco: ${category.name} (ID: ${id})`);
    
    return NextResponse.json({ 
      success: true,
      message: "Categoria, produtos e arquivos deletados com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 });
  }
}