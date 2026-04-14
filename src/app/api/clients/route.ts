import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import Client from "@/database/models/Client";

export async function GET() {
  try {
    await connectMongo();
    const clients = await Client.find().sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const client = await Client.create(body);
    
    // Criar pasta no S3
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || "sa-east-1",
    });

    await s3.putObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "tizeck-clients",
      Key: `clientes/${client._id}/`,
      Body: "",
    }).promise();

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 });
  }
}
