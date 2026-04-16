import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { connectMongoLegacy } from "@/database/dbLegacy";
import { FirebirdImportService } from "@/database/services/firebirdImportService";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !file.name.endsWith(".GDB")) {
      return NextResponse.json({ error: "Arquivo .GDB inválido" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(process.cwd(), "temp", file.name);
    
    await writeFile(tempPath, buffer);

    await connectMongoLegacy();
    const importService = new FirebirdImportService(tempPath);
    const result = await importService.runFullImport(file.name);

    await unlink(tempPath);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: `Erro na importação: ${error}` }, { status: 500 });
  }
}
