import { NextRequest, NextResponse } from "next/server";
import { copyFile, access, stat, unlink } from "fs/promises";
import { join } from "path";
import { connectMongo } from "@/database/db";
import { BackupService } from "@/database/services/backupService";
import { jwtVerify } from "jose";
import { getJwtSecretEncoded } from "@/lib/jwt";
import { constants } from "fs";

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const FIXED_SOURCE_PATH = "C:\\Gerenciador\\Banco\\KONE_VD.GDB";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, getJwtSecretEncoded());
    } catch {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Validar existência do arquivo
    try {
      await access(FIXED_SOURCE_PATH, constants.F_OK | constants.R_OK);
    } catch {
      return NextResponse.json({ 
        status: 'error',
        error: "Arquivo de backup não encontrado no local padrão."
      }, { status: 404 });
    }

    // Validar extensão
    if (!FIXED_SOURCE_PATH.endsWith(".GDB")) {
      return NextResponse.json({ 
        status: 'error',
        error: "Erro ao processar o backup. Tente novamente."
      }, { status: 400 });
    }

    // Validar tamanho e legibilidade
    let fileStats;
    try {
      fileStats = await stat(FIXED_SOURCE_PATH);
      if (fileStats.size === 0) {
        return NextResponse.json({ 
          status: 'error',
          error: "Erro ao processar o backup. Tente novamente."
        }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ 
        status: 'error',
        error: "Erro ao processar o backup. Tente novamente."
      }, { status: 500 });
    }

    // Copiar para temp
    const tempFileName = `backup_${Date.now()}.GDB`;
    const tempPath = join(process.cwd(), "temp", tempFileName);
    
    try {
      await copyFile(FIXED_SOURCE_PATH, tempPath);
    } catch {
      return NextResponse.json({ 
        status: 'error',
        error: "Erro ao processar o backup. Tente novamente."
      }, { status: 500 });
    }

    await connectMongo();

    const weekday = BackupService.getWeekdayName();
    const targetDatabase = BackupService.getTargetDatabase();

    const result = await BackupService.executeBackup({
      weekday,
      targetDatabase,
      executedBy: 'admin',
      sourceFile: tempPath,
      fileSize: fileStats.size
    });

    await unlink(tempPath);

    if (result.success) {
      return NextResponse.json({
        status: 'success',
        message: "Backup realizado com sucesso.",
        targetDatabase,
        weekday,
        stats: result.importStats
      });
    } else {
      return NextResponse.json({
        status: 'error',
        error: "Erro ao processar o backup. Tente novamente."
      }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ 
      status: 'error',
      error: "Erro ao processar o backup. Tente novamente."
    }, { status: 500 });
  }
}
