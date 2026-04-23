import { NextResponse } from "next/server";
import { connectBackupDatabase } from "@/database/dbBackup";
import SystemUser from "@/database/models/SystemUser";

export async function GET() {
  try {
    const conn = await connectBackupDatabase();
    const SystemUserModel = conn.models.SystemUser || conn.model('SystemUser', SystemUser.schema);
    const users = await SystemUserModel.find().sort({ legacyId: 1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar usuários: ${error}` }, { status: 500 });
  }
}
