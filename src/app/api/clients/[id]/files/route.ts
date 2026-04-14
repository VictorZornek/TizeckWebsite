import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import ClientFile from "@/database/models/ClientFile";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "sa-east-1",
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const files = await ClientFile.find({ clientId: id }).sort({ createdAt: -1 });
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar arquivos" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande (máximo 10MB)" }, { status: 400 });
    }

    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const s3Key = `clientes/${id}/${timestamp}_${file.name}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "tizeck-clients",
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
    }).promise();

    const clientFile = await ClientFile.create({
      clientId: id,
      fileName: file.name,
      s3Key,
      mimeType: file.type,
      size: file.size,
    });

    return NextResponse.json(clientFile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 });
  }
}
