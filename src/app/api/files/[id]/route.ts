import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import ClientFile from "@/database/models/ClientFile";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "sa-east-1",
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    
    const file = await ClientFile.findById(id);
    
    if (!file) {
      return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
    }

    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "tizeck-clients",
      Key: file.s3Key,
    }).promise();

    await ClientFile.findByIdAndDelete(id);

    return NextResponse.json({ message: "Arquivo deletado com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar arquivo" }, { status: 500 });
  }
}
