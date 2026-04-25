import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { connectMongo } from "@/database/db";
import { BackupService } from "@/database/services/backupService";
import { jwtVerify } from "jose";
import { getJwtSecretEncoded } from "@/lib/jwt";

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado", message: "Token ausente" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, getJwtSecretEncoded());
    } catch {
      return NextResponse.json(
        { error: "Não autorizado", message: "Token inválido" },
        { status: 401 }
      );
    }

    const contentLength = request.headers.get('content-length');
    console.log(`[IMPORT] Tamanho do body: ${contentLength} bytes`);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !file.name.endsWith(".GDB")) {
      return NextResponse.json({ error: "Arquivo .GDB inválido" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(process.cwd(), "temp", file.name);
    
    await writeFile(tempPath, buffer);

    await connectMongo();

    // Identificar dia da semana e banco de destino
    const weekday = BackupService.getWeekdayName();
    const targetDatabase = BackupService.getTargetDatabase();

    // Executar backup com sistema rotativo
    const result = await BackupService.executeBackup({
      weekday,
      targetDatabase,
      executedBy: 'admin',
      sourceFile: tempPath,
      fileSize: buffer.length
    });

    await unlink(tempPath);

    if (result.success) {
      return NextResponse.json({
        status: 'success',
        message: result.message,
        targetDatabase,
        weekday,
        stats: result.importStats,
        logs: [`Backup criado em: ${targetDatabase}`, `Dia da semana: ${weekday}`]
      });
    } else {
      return NextResponse.json({
        status: 'error',
        error: result.error,
        logs: [result.message]
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      error: `Erro na importação: ${error.message}`,
      logs: [error.message]
    }, { status: 500 });
  }
}
