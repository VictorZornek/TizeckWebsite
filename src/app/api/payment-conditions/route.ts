import { NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import PaymentCondition from "@/database/models/PaymentCondition";

export async function GET() {
  try {
    const conn = await connectMongoLegacy();
    const PaymentConditionModel = conn.models.PaymentCondition || conn.model('PaymentCondition', PaymentCondition.schema);
    const conditions = await PaymentConditionModel.find().sort({ legacyId: 1 });
    return NextResponse.json(conditions);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar condições: ${error}` }, { status: 500 });
  }
}
