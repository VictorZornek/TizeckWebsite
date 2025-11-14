import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: "URL da imagem não fornecida" }, { status: 400 });
    }

    const url = new URL(imageUrl);
    const key = decodeURIComponent(url.pathname.substring(1));
    
    if (!key) {
      return NextResponse.json({ error: "Chave da imagem inválida" }, { status: 400 });
    }

    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    }).promise();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar do S3:", error);
    return NextResponse.json({ error: "Erro ao deletar imagem" }, { status: 500 });
  }
}
