import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/database/db';
import { BackupService } from '@/database/services/backupService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * GET /api/backup/stats
 * Retorna estatísticas de backups
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
