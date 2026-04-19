import { NextRequest, NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import StockEntry from "@/database/models/StockEntry";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get("productCode") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const conn = await connectMongoLegacy();
    const StockEntryModel = conn.models.StockEntry || conn.model('StockEntry', StockEntry.schema);
    
    const query: Record<string, unknown> = {};
    if (productCode) query.productCode = parseInt(productCode);

    const skip = (page - 1) * limit;
    const total = await StockEntryModel.countDocuments(query);
    const entries = await StockEntryModel.find(query)
      .sort({ entryDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      data: entries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar entradas: ${error}` }, { status: 500 });
  }
}
