import { NextResponse } from "next/server";
import { connectMongo } from "@/database/db";
import ImportHistory from "@/database/models/ImportHistory";

export async function GET() {
  try {
    await connectMongo();
    const history = await ImportHistory.find().sort({ importDate: -1 }).limit(20);
    return NextResponse.json(history);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar histórico" }, { status: 500 });
  }
}
