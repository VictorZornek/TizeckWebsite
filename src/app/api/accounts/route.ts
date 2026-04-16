import { NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import Account from "@/database/models/Account";

export async function GET() {
  try {
    const conn = await connectMongoLegacy();
    const AccountModel = conn.models.Account || conn.model('Account', Account.schema);
    const accounts = await AccountModel.find().sort({ dueDate: -1 }).limit(100);
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar contas: ${error}` }, { status: 500 });
  }
}
