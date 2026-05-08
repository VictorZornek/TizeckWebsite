import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile, unlink } from "fs/promises";
import { createHash, timingSafeEqual } from "crypto";
import { join } from "path";
import { tmpdir } from "os";
import { connectMongo } from "@/database/db";
import { BackupService } from "@/database/services/backupService";
import BackupLog from "@/database/models/BackupLog";
import { logError } from "@/lib/logger";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const TMP_IMPORT_DIR = join(tmpdir(), "tizeck-imports");

function isValidBackupAgentToken(headerValue: string | null): boolean {
  const secret = process.env.BACKUP_AGENT_TOKEN;
  if (!secret || secret.length === 0) {
    return false;
  }
  if (!headerValue || headerValue.length === 0) {
    return false;
  }
  try {
    const expected = createHash("sha256").update(secret, "utf8").digest();
    const received = createHash("sha256").update(headerValue, "utf8").digest();
    return timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}

function safeBasename(name: string): string {
  const base = name.replace(/\\/g, "/").split("/").pop() || "backup.gdb";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180);
}

interface AgentResponseBody {
  status: "success" | "error";
  bancoDestino: string | null;
  diaSemana: string | null;
  documentosImportados: number;
  mensagem: string;
}

async function getDocumentsImportedFromLog(
  logId: string | undefined,
): Promise<number> {
  if (!logId) return 0;

  try {
    await connectMongo();

    const doc = await BackupLog.findById(logId)
      .select("validationResult")
      .lean() as {
        validationResult?: {
          documentsCount?: number;
        };
      } | null;

    return doc?.validationResult?.documentsCount ?? 0;
  } catch {
    return 0;
  }
}

export async function POST(request: NextRequest) {
  const weekday = BackupService.getWeekdayName();
  const targetDatabase = BackupService.getTargetDatabase();

  let tempPath: string | null = null;

  try {
    if (!isValidBackupAgentToken(request.headers.get("x-backup-token"))) {
      const body: AgentResponseBody = {
        status: "error",
        bancoDestino: null,
        diaSemana: null,
        documentosImportados: 0,
        mensagem: "Token ausente ou inválido.",
      };
      return NextResponse.json(body, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string" || !("name" in file)) {
      const body: AgentResponseBody = {
        status: "error",
        bancoDestino: targetDatabase,
        diaSemana: weekday,
        documentosImportados: 0,
        mensagem: "Nenhum arquivo foi enviado.",
      };
      return NextResponse.json(body, { status: 400 });
    }

    const fileName = file.name;
    if (!fileName.toLowerCase().endsWith(".gdb")) {
      const body: AgentResponseBody = {
        status: "error",
        bancoDestino: targetDatabase,
        diaSemana: weekday,
        documentosImportados: 0,
        mensagem: "Apenas arquivos com extensão .GDB são aceitos.",
      };
      return NextResponse.json(body, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (buffer.length === 0) {
      const body: AgentResponseBody = {
        status: "error",
        bancoDestino: targetDatabase,
        diaSemana: weekday,
        documentosImportados: 0,
        mensagem: "O arquivo enviado está vazio.",
      };
      return NextResponse.json(body, { status: 400 });
    }

    await mkdir(TMP_IMPORT_DIR, { recursive: true });
    const unique = `backup_${Date.now()}_${safeBasename(fileName)}`;
    tempPath = join(TMP_IMPORT_DIR, unique);
    await writeFile(tempPath, buffer);

    await connectMongo();

    const result = await BackupService.executeBackup({
      weekday,
      targetDatabase,
      executedBy: "backup-agent",
      sourceFile: tempPath,
      fileSize: buffer.length,
    });

    const documentosImportados = result.success
      ? await getDocumentsImportedFromLog(result.logId)
      : 0;

    if (result.success) {
      const body: AgentResponseBody = {
        status: "success",
        bancoDestino: targetDatabase,
        diaSemana: weekday,
        documentosImportados,
        mensagem: result.message || "Backup importado com sucesso.",
      };
      return NextResponse.json(body);
    }

    const body: AgentResponseBody = {
      status: "error",
      bancoDestino: targetDatabase,
      diaSemana: weekday,
      documentosImportados: 0,
      mensagem: "Erro ao processar o backup. Tente novamente.",
    };
    return NextResponse.json(body, { status: 500 });
  } catch (error: unknown) {
    logError("IMPORT_UPLOAD_AGENT", error);
    const body: AgentResponseBody = {
      status: "error",
      bancoDestino: targetDatabase,
      diaSemana: weekday,
      documentosImportados: 0,
      mensagem: "Erro ao processar o backup. Tente novamente.",
    };
    return NextResponse.json(body, { status: 500 });
  } finally {
    if (tempPath) {
      await unlink(tempPath).catch(() => {});
    }
  }
}
