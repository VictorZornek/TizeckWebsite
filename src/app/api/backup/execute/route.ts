import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/database/db';
import { BackupService } from '@/database/services/backupService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * POST /api/backup/execute
 * Executa o processo de backup
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    await connectMongo();

    const body = await request.json();
    const { sourceFile, fileSize } = body;

    // Identificar dia da semana e banco de destino
    const weekday = BackupService.getWeekdayName();
    const targetDatabase = BackupService.getTargetDatabase();

    // Validar se é fim de semana (configurável)
    if (weekday === 'sabado' || weekday === 'domingo') {
      return NextResponse.json({
        error: 'Backups em finais de semana devem ser configurados manualmente',
        weekday,
        suggestion: 'Use o endpoint /api/backup/execute-manual para forçar execução'
      }, { status: 400 });
    }

    // Executar backup
    const result = await BackupService.executeBackup({
      weekday,
      targetDatabase,
      executedBy: decoded.email || decoded.username,
      sourceFile,
      fileSize
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        logId: result.logId,
        targetDatabase,
        weekday
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error,
        logId: result.logId
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Erro ao executar backup:', error);
    return NextResponse.json({
      error: 'Erro ao executar backup',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/backup/execute
 * Retorna informações sobre o próximo backup
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

    const weekday = BackupService.getWeekdayName();
    const targetDatabase = BackupService.getTargetDatabase();
    const isFirstBusinessDay = BackupService.isFirstBusinessDayOfMonth();
    const lastBackup = await BackupService.getLastSuccessfulBackup();

    return NextResponse.json({
      currentWeekday: weekday,
      targetDatabase,
      isFirstBusinessDay,
      willCreateMonthlySnapshot: isFirstBusinessDay,
      monthlySnapshotName: isFirstBusinessDay ? BackupService.getMonthlyDatabaseName(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) : null,
      lastSuccessfulBackup: lastBackup
    });

  } catch (error: any) {
    console.error('Erro ao obter informações de backup:', error);
    return NextResponse.json({
      error: 'Erro ao obter informações',
      details: error.message
    }, { status: 500 });
  }
}
