import { NextResponse } from "next/server";
import { connectBackupDatabase } from "@/database/dbBackup";
import SystemUser from "@/database/models/SystemUser";

export async function GET() {
  try {
    const conn = await connectBackupDatabase();
    const SystemUserModel = conn.models.SystemUser || conn.model('SystemUser', SystemUser.schema);
    
    // Usar select para excluir password e __v da resposta
    const users = await SystemUserModel
      .find()
      .select('-password -__v')
      .sort({ legacyId: 1 })
      .lean();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}
