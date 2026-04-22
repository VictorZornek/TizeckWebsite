import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/database/db';
import { BackupService } from '@/database/services/backupService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * GET /api/backup/history
 * Retorna histórico de backups
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
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
