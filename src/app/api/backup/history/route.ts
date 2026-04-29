import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/database/db';
import { BackupService } from '@/database/services/backupService';
import { jwtVerify } from 'jose';
import { getJwtSecretEncoded } from '@/lib/jwt';

/**
 * GET /api/backup/history
 * Retorna histórico de backups
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const history = await BackupService.getBackupHistory(limit);

    return NextResponse.json({
      success: true,
      count: history.length,
      history
    });

  } catch (error: any) {
    console.error('Erro ao obter histórico de backup:', error);
    return NextResponse.json({
      error: 'Erro ao obter histórico',
      details: error.message
    }, { status: 500 });
  }
}
