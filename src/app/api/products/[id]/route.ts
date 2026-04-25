import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Products from "@/database/models/Product";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, description, category, images, specifications, activated, featured } = await request.json();
    
    await connectMongo();
    
    const oldProduct = await Products.findById(id);
    
    if (!oldProduct) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }
    
    const oldName = oldProduct.name;
    const oldCategory = oldProduct.category;
    const nameChanged = oldName !== name;
    const categoryChanged = oldCategory !== category;
    
    // Se nome ou categoria mudaram, precisamos mover a pasta no S3
    if (nameChanged || categoryChanged) {
      try {
        const oldSanitized = oldName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
        const newSanitized = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
        
        const oldPrefix = `${oldCategory}/${oldSanitized}/`;
        const newPrefix = `${category}/${newSanitized}/`;
        
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
          const updatedImages = images.map((img: string) => 
            img.replace(oldPrefix, newPrefix)
          );
          
          const product = await Products.findByIdAndUpdate(
            id,
            { name, description, category, images: updatedImages, specifications, activated, featured },
            { new: true }
          );
          
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
      id,
      { name, description, category, images, specifications, activated, featured },
      { new: true }
    );
    
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectMongo();
    
    const product = await Products.findById(id);
    
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
    await Products.findByIdAndDelete(id);
    
    console.log(`✓ Produto deletado do banco: ${product.name} (ID: ${id})`);
    
    return NextResponse.json({ 
      success: true,
      message: "Produto e imagens deletados com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
  }
}