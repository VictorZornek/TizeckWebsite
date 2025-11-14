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
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, image, activated },
      { new: true }
    );
    
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch {
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

    // Deletar todos os produtos da categoria
    await Product.deleteMany({ category: category.name });

    // Deletar pasta da categoria no S3
    try {
      const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Prefix: `${category.name}/`,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key: Key! })) },
        };

        await s3.deleteObjects(deleteParams).promise();
      }
    } catch (error) {
      console.error("Erro ao deletar pasta do S3:", error);
    }

    await Category.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 });
  }
}