import { NextRequest, NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import OrderInstallment from "@/database/models/OrderInstallment";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("orderCode");

    const conn = await connectMongoLegacy();
    const OrderInstallmentModel = conn.models.OrderInstallment || conn.model('OrderInstallment', OrderInstallment.schema);
    
    const filter = orderCode ? { orderCode: parseInt(orderCode) } : {};
    const installments = await OrderInstallmentModel.find(filter).sort({ dueDate: 1 });
    
    return NextResponse.json(installments);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar parcelas: ${error}` }, { status: 500 });
  }
}
