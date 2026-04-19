import { NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import ImportHistory from "@/database/models/ImportHistory";

export async function GET() {
  try {
    const conn = await connectMongoLegacy();
    const ImportHistoryModel = conn.model('ImportHistory', ImportHistory.schema);
    const history = await ImportHistoryModel.find().sort({ importDate: -1 }).limit(20);
    return NextResponse.json(history);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar histórico" }, { status: 500 });
  }
}
