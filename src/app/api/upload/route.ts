import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const productName = formData.get("productName") as string;
    const uploadType = formData.get("uploadType") as string;
    
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    
    let key: string;
    let bucketName: string;
    
    if (uploadType === 'category') {
      bucketName = process.env.AWS_S3_BUCKET_CATEGORIES!;
      key = `categories/${fileName}`;
    } else {
      bucketName = process.env.AWS_S3_BUCKET_PRODUCTS!;
      if (!category || !productName) {
        return NextResponse.json({ error: "Categoria e nome do produto são obrigatórios" }, { status: 400 });
      }
      const sanitizedProductName = productName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
      key = `${category}/${sanitizedProductName}/${fileName}`;
    }
    
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read' as const,
    };

    const result = await s3.upload(uploadParams).promise();
    
    return NextResponse.json({ url: result.Location });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}