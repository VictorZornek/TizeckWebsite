import { NextResponse } from "next/server";
import { connectMongoLegacy } from "@/database/dbLegacy";
import Region from "@/database/models/Region";

export async function GET() {
  try {
    const conn = await connectMongoLegacy();
    const RegionModel = conn.models.Region || conn.model('Region', Region.schema);
    const regions = await RegionModel.find().sort({ name: 1 });
    return NextResponse.json(regions);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar regiões: ${error}` }, { status: 500 });
  }
}
