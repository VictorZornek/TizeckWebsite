import { NextRequest, NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import CustomerItem from "@/database/models/CustomerItem";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerCode = searchParams.get("customerCode");

    const conn = await connectMongoLegacy();
    const CustomerItemModel = conn.models.CustomerItem || conn.model('CustomerItem', CustomerItem.schema);
    
    const filter = customerCode ? { customerCode: parseInt(customerCode) } : {};
    const items = await CustomerItemModel.find(filter).sort({ date: -1 }).limit(100);
    
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar histórico: ${error}` }, { status: 500 });
  }
}
