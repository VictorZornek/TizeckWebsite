import { NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import StockEntry from "@/database/models/StockEntry";

export async function GET() {
  try {
    const conn = await connectMongoLegacy();
    const StockEntryModel = conn.models.StockEntry || conn.model('StockEntry', StockEntry.schema);
    const entries = await StockEntryModel.find().sort({ entryDate: -1 }).limit(100);
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar entradas: ${error}` }, { status: 500 });
  }
}
