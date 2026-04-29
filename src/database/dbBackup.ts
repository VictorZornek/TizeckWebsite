import mongoose, { Connection } from 'mongoose';
import { BackupService } from './services/backupService';

type Cached = {
  conn: Connection | null;
  promise: Promise<Connection> | null;
  currentDatabase: string | null;
}

declare global {
  var _mongooseBackup: Cached | undefined;
}

if (!global._mongooseBackup) {
  global._mongooseBackup = { conn: null, promise: null, currentDatabase: null };
}

/**
 * Conecta ao banco de backup do DIA ANTERIOR
 * A aplica\u00e7\u00e3o sempre l\u00ea do backup de ontem enquanto o de hoje est\u00e1 sendo atualizado
 */
export async function connectBackupDatabase() {
  const targetDatabase = BackupService.getPreviousDayDatabase();
  
  // Se j\u00e1 est\u00e1 conectado no banco correto, retorna
  if (global._mongooseBackup!.conn && global._mongooseBackup!.currentDatabase === targetDatabase) {
    return global._mongooseBackup!.conn;
  }

  // Fechar conex\u00e3o anterior se existir
  if (global._mongooseBackup!.conn) {
    await global._mongooseBackup!.conn.close();
    global._mongooseBackup!.conn = null;
    global._mongooseBackup!.promise = null;
  }

  if (!global._mongooseBackup!.promise) {
    const baseUri = process.env.MONGODB_URI || '';
    const uri = baseUri.replace(/\/[^\/]*(\?|$)/, `/${targetDatabase}$1`);
    
    global._mongooseBackup!.promise = mongoose.createConnection(uri, {
      bufferCommands: false,
    }).asPromise();
  }

  global._mongooseBackup!.conn = await global._mongooseBackup!.promise;
  global._mongooseBackup!.currentDatabase = targetDatabase;

  if (process.env.NODE_ENV !== "production") {
    console.log(`✅ Conectado ao backup: ${targetDatabase}`);
  }

  return global._mongooseBackup!.conn;
}
