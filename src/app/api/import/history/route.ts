import { NextResponse } from "next/server";
import { BackupService } from "@/database/services/backupService";

export async function GET() {
  try {
    const history = await BackupService.getBackupHistory(20);
    
    // Adaptar formato do BackupLog para o formato esperado pelo frontend
    const adaptedHistory = history.map((log: any) => ({
      _id: log._id,
      fileName: log.sourceFile?.split(/[\\\/]/).pop() || 'backup.gdb',
      importDate: log.executionDate,
      status: log.status,
      stats: log.validationResult ? {
        customers: { imported: 0, errors: 0, new: 0, updated: 0 },
        products: { imported: 0, errors: 0, new: 0, updated: 0 },
        orders: { imported: 0, errors: 0, new: 0, updated: 0 },
        paymentConditions: { imported: 0, errors: 0, new: 0, updated: 0 },
        accounts: { imported: 0, errors: 0, new: 0, updated: 0 },
        stockEntries: { imported: 0, errors: 0, new: 0, updated: 0 },
        jobFunctions: { imported: 0, errors: 0, new: 0, updated: 0 },
        employees: { imported: 0, errors: 0, new: 0, updated: 0 },
        regions: { imported: 0, errors: 0, new: 0, updated: 0 },
        conditionItems: { imported: 0, errors: 0, new: 0, updated: 0 },
        orderInstallments: { imported: 0, errors: 0, new: 0, updated: 0 },
        companySettings: { imported: 0, errors: 0, new: 0, updated: 0 },
        customerItems: { imported: 0, errors: 0, new: 0, updated: 0 },
        systemUsers: { imported: 0, errors: 0, new: 0, updated: 0 },
      } : {},
      processingTime: log.duration ? Math.round(log.duration / 1000) : 0,
      targetDatabase: log.targetDatabase,
      weekday: log.weekday,
      backupType: log.backupType,
      collectionsCount: log.validationResult?.collectionsCount || 0,
      documentsCount: log.validationResult?.documentsCount || 0,
    }));
    
    return NextResponse.json(adaptedHistory);
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao buscar histórico", message: error.message }, { status: 500 });
  }
}
