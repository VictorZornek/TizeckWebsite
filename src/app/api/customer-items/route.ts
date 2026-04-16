import { NextRequest, NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import CustomerItem from "@/database/models/CustomerItem";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerCode = searchParams.get("customerCode");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const conn = await connectMongoLegacy();
    const CustomerItemModel = conn.models.CustomerItem || conn.model('CustomerItem', CustomerItem.schema);
    
    const query: any = {};
    if (customerCode) query.customerCode = parseInt(customerCode);

    const skip = (page - 1) * limit;
    const total = await CustomerItemModel.countDocuments(query);
    const items = await CustomerItemModel.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      data: items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar histórico: ${error}` }, { status: 500 });
  }
}
