import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Client from "@/database/models/Client";
import AWS from "aws-sdk";
import ClientFile from "@/database/models/ClientFile";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "sa-east-1",
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const client = await Client.findByIdAndUpdate(id, body, { new: true });
    
    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    
    const files = await ClientFile.find({ clientId: id });
    
    for (const file of files) {
      await s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME || "tizeck-clients",
        Key: file.s3Key,
      }).promise();
    }
    
    await ClientFile.deleteMany({ clientId: id });
    
    // Deletar pasta do S3
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "tizeck-clients",
      Key: `clientes/${id}/`,
    }).promise();
    
    const client = await Client.findByIdAndDelete(id);
    
    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar cliente" }, { status: 500 });
  }
}
