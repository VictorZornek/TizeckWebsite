import mongoose, { Connection } from 'mongoose';
import { connectMongo } from '../db';

export interface BackupConfig {
  weekday: string;
  targetDatabase: string;
  executedBy: string;
  sourceFile?: string;
  fileSize?: number;
}

export interface ValidationResult {
  collectionsCount: number;
  documentsCount: number;
  isValid: boolean;
}

export class BackupService {
  private static readonly WEEKDAY_DATABASES = {
    'segunda': 'backup_segunda',
    'terca': 'backup_terca',
    'quarta': 'backup_quarta',
    'quinta': 'backup_quinta',
    'sexta': 'backup_sexta',
    'sabado': 'backup_sabado',
    'domingo': 'backup_domingo'
  };

  private static readonly TEMP_DATABASE = 'backup_temp_restore';

  /**
   * Identifica o banco de destino baseado no dia da semana
   */
  static getTargetDatabase(date: Date = new Date()): string {
    const weekdays = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const weekday = weekdays[date.getDay()];
    return this.WEEKDAY_DATABASES[weekday as keyof typeof this.WEEKDAY_DATABASES];
  }

  /**
   * Obtém o banco do dia ANTERIOR (para leitura pela aplicação)
   */
  static getPreviousDayDatabase(date: Date = new Date()): string {
    const weekdays = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekday = weekdays[yesterday.getDay()];
    return this.WEEKDAY_DATABASES[weekday as keyof typeof this.WEEKDAY_DATABASES];
  }

  /**
   * Obtém o nome do dia da semana em português
   */
  static getWeekdayName(date: Date = new Date()): string {
    const weekdays = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    return weekdays[date.getDay()];
  }

  /**
   * Verifica se é o primeiro dia útil do mês
   */
  static isFirstBusinessDayOfMonth(date: Date = new Date()): boolean {
    const day = date.getDate();
    const weekday = date.getDay();
    
    // Se é dia 1 e não é fim de semana
    if (day === 1 && weekday !== 0 && weekday !== 6) {
      return true;
    }
    
    // Se é dia 2 ou 3 e o dia 1 foi fim de semana
    if (day === 2 && weekday === 1) { // Segunda-feira dia 2
      return true;
    }
    
    if (day === 3 && weekday === 1) { // Segunda-feira dia 3
      return true;
    }
    
    return false;
  }

  /**
   * Gera o nome do banco mensal
   */
  static getMonthlyDatabaseName(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `backup_mensal_${year}_${month}`;
  }

  /**
   * Cria log de execução
   */
  static async createBackupLog(config: BackupConfig): Promise<string> {
    await connectMongo();
    const BackupLog = (await import('../models/BackupLog')).default;
    
    const log = new BackupLog({
      executionDate: new Date(),
      weekday: config.weekday,
      targetDatabase: config.targetDatabase,
      status: 'in_progress',
      sourceFile: config.sourceFile,
      fileSize: config.fileSize,
      executedBy: config.executedBy,
      backupType: 'daily'
    });

    await log.save();
    return log._id.toString();
  }

  /**
   * Atualiza log de execução
   */
  static async updateBackupLog(
    logId: string, 
    updates: {
      status?: 'success' | 'failed';
      errorMessage?: string;
      validationResult?: ValidationResult;
      duration?: number;
      backupType?: 'daily' | 'monthly';
      monthlySnapshot?: string;
    }
  ): Promise<void> {
    await connectMongo();
    const BackupLog = (await import('../models/BackupLog')).default;
    await BackupLog.findByIdAndUpdate(logId, updates);
  }

  /**
   * Obtém o último backup bem-sucedido
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getLastSuccessfulBackup(): Promise<any> {
    await connectMongo();
    const BackupLog = (await import('../models/BackupLog')).default;
    return await BackupLog.findOne({ status: 'success' })
      .sort({ executionDate: -1 })
      .lean();
  }

  /**
   * Cria conexão com banco específico
   */
  static async createConnection(databaseName: string): Promise<Connection> {
    const baseUri = process.env.MONGODB_URI || '';
    const uri = baseUri.replace(/\/[^\/]*(\?|$)/, `/${databaseName}$1`);
    
    const connection = await mongoose.createConnection(uri, {
      bufferCommands: false,
    }).asPromise();

    return connection;
  }

  /**
   * Valida se o banco foi restaurado corretamente
   */
  static async validateDatabase(connection: Connection): Promise<ValidationResult> {
    try {
      const collections = await connection.db!.listCollections().toArray();
      const collectionsCount = collections.length;
      
      let documentsCount = 0;
      for (const collection of collections) {
        const count = await connection.db!.collection(collection.name).countDocuments();
        documentsCount += count;
      }

      const isValid = collectionsCount > 0 && documentsCount > 0;

      return {
        collectionsCount,
        documentsCount,
        isValid
      };
    } catch {
      return {
        collectionsCount: 0,
        documentsCount: 0,
        isValid: false
      };
    }
  }

  /**
   * Copia dados de um banco para outro (DROP + INSERT - mais rápido)
   */
  static async copyDatabase(sourceConn: Connection, targetConn: Connection): Promise<void> {
    const collections = await sourceConn.db!.listCollections().toArray();
    
    // 1. DROP todas as collections do destino
    const targetCollections = await targetConn.db!.listCollections().toArray();
    for (const collectionInfo of targetCollections) {
      if (!collectionInfo.name.startsWith('system.')) {
        await targetConn.db!.collection(collectionInfo.name).drop().catch(() => {});
      }
    }
    
    // 2. Copiar todas as collections da fonte
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      
      // Pular collections do sistema
      if (collectionName.startsWith('system.')) continue;
      
      const sourceCollection = sourceConn.db!.collection(collectionName);
      const targetCollection = targetConn.db!.collection(collectionName);
      
      // Buscar TODOS os documentos de uma vez
      const allDocuments = await sourceCollection.find({}).toArray();
      
      // Inserir tudo de uma vez se houver documentos
      if (allDocuments.length > 0) {
        await targetCollection.insertMany(allDocuments, { ordered: false });
      }
      
      // Copiar índices
      const indexes = await sourceCollection.indexes();
      for (const index of indexes) {
        if (index.name !== '_id_') {
          try {
            const key = index.key;
            const options: Record<string, unknown> = { name: index.name };
            if (index.unique) options.unique = true;
            if (index.sparse) options.sparse = true;
            await targetCollection.createIndex(key, options);
          } catch {
            console.warn(`Aviso: não foi possível criar índice ${index.name}`);
          }
        }
      }
    }
  }

  /**
   * Executa o processo completo de backup
   */
  static async executeBackup(config: BackupConfig): Promise<{
    success: boolean;
    logId: string;
    message: string;
    error?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    importStats?: any;
  }> {
    const startTime = Date.now();
    let logId: string = '';
    let targetConn: Connection | null = null;

    try {
      // 1. Criar log inicial
      logId = await this.createBackupLog(config);

      // 2. Validar arquivo Firebird
      if (!config.sourceFile) {
        throw new Error('Arquivo .gdb não fornecido');
      }

      // 3. Conectar ao banco de destino (dia atual)
      targetConn = await this.createConnection(config.targetDatabase);

      // 4. DROP todas as collections do banco de destino
      const targetCollections = await targetConn.db!.listCollections().toArray();
      for (const collectionInfo of targetCollections) {
        if (!collectionInfo.name.startsWith('system.')) {
          await targetConn.db!.collection(collectionInfo.name).drop().catch(() => {});
        }
      }

      // 5. Importar do Firebird DIRETO para o banco do dia
      const { FastFirebirdImportService } = await import('./fastFirebirdImportService');
      
      // Criar importer que vai importar direto para o banco de destino
      const importer = new FastFirebirdImportService(config.sourceFile, targetConn);
      
      // Executar importação completa no banco do dia
      const importResult = await importer.runFullImport(config.sourceFile);
      
      if (importResult.status === 'error') {
        throw new Error(`Falha na importação: ${importResult.errors.join(', ')}`);
      }

      // 6. Validar banco de destino
      const finalValidation = await this.validateDatabase(targetConn);
      
      if (!finalValidation.isValid) {
        throw new Error('Validação do banco de destino falhou');
      }

      // 7. Verificar se deve criar snapshot mensal
      if (this.isFirstBusinessDayOfMonth()) {
        const monthlyDbName = this.getMonthlyDatabaseName(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const monthlyConn = await this.createConnection(monthlyDbName);
        await this.copyDatabase(targetConn, monthlyConn);
        await monthlyConn.close();

        await this.updateBackupLog(logId, {
          status: 'success',
          validationResult: finalValidation,
          duration: Date.now() - startTime,
          backupType: 'monthly',
          monthlySnapshot: monthlyDbName
        });
      } else {
        await this.updateBackupLog(logId, {
          status: 'success',
          validationResult: finalValidation,
          duration: Date.now() - startTime
        });
      }

      return {
        success: true,
        logId,
        message: 'Backup executado com sucesso',
        importStats: importResult.stats
      };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (logId) {
        await this.updateBackupLog(logId, {
          status: 'failed',
          errorMessage,
          duration: Date.now() - startTime
        });
      }

      return {
        success: false,
        logId,
        message: 'Falha ao executar backup',
        error: errorMessage
      };

    } finally {
      // Fechar conexão
      if (targetConn) await targetConn.close();
    }
  }

  /**
   * Lista histórico de backups
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getBackupHistory(limit: number = 50): Promise<any[]> {
    await connectMongo();
    const BackupLog = (await import('../models/BackupLog')).default;
    return await BackupLog.find()
      .sort({ executionDate: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * Obtém estatísticas de backups
   */
  static async getBackupStats(): Promise<{
    total: number;
    successful: number;
    failed: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastBackup: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    weeklyStatus: Record<string, any>;
  }> {
    await connectMongo();
    const BackupLog = (await import('../models/BackupLog')).default;
    
    const total = await BackupLog.countDocuments();
    const successful = await BackupLog.countDocuments({ status: 'success' });
    const failed = await BackupLog.countDocuments({ status: 'failed' });
    const lastBackup = await this.getLastSuccessfulBackup();

    const weeklyStatus: Record<string, any> = {};
    for (const [weekday, dbName] of Object.entries(this.WEEKDAY_DATABASES)) {
      const lastBackupForDay = await BackupLog.findOne({ 
        targetDatabase: dbName,
        status: 'success'
      }).sort({ executionDate: -1 }).lean();
      
      weeklyStatus[weekday] = lastBackupForDay;
    }

    return {
      total,
      successful,
      failed,
      lastBackup,
      weeklyStatus
    };
  }
}
