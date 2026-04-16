import { NextRequest, NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import OrderInstallment from "@/database/models/OrderInstallment";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const conn = await connectMongoLegacy();
    const OrderInstallmentModel = conn.models.OrderInstallment || conn.model('OrderInstallment', OrderInstallment.schema);
    
    const query: any = {};
    if (orderCode) query.orderCode = parseInt(orderCode);
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await OrderInstallmentModel.countDocuments(query);
    const installments = await OrderInstallmentModel.find(query)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      data: installments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar parcelas: ${error}` }, { status: 500 });
  }
}
