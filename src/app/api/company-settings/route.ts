import { NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import CompanySettings from "@/database/models/CompanySettings";

export async function GET() {
  try {
    const conn = await connectMongoLegacy();
    const CompanySettingsModel = conn.models.CompanySettings || conn.model('CompanySettings', CompanySettings.schema);
    const settings = await CompanySettingsModel.findOne();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar configurações: ${error}` }, { status: 500 });
  }
}
