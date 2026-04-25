import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/database/db';
import { BackupService } from '@/database/services/backupService';
import { jwtVerify } from 'jose';
import { getJwtSecretEncoded } from '@/lib/jwt';

/**
 * GET /api/backup/stats
 * Retorna estatísticas de backups
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
      await jwtVerify(token, getJwtSecretEncoded());
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    await connectMongo();

    const stats = await BackupService.getBackupStats();

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error: any) {
    console.error('Erro ao obter estatísticas de backup:', error);
    return NextResponse.json({
      error: 'Erro ao obter estatísticas',
      details: error.message
    }, { status: 500 });
  }
}
