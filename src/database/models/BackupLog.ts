import mongoose, { Schema, Document } from 'mongoose';

export interface IBackupLog extends Document {
  executionDate: Date;
  weekday: string;
  targetDatabase: string;
  status: 'success' | 'failed' | 'in_progress';
  sourceFile?: string;
  fileSize?: number;
  errorMessage?: string;
  executedBy: string;
  validationResult?: {
    collectionsCount: number;
    documentsCount: number;
    isValid: boolean;
  };
  duration?: number;
  backupType: 'daily' | 'monthly';
  monthlySnapshot?: string;
}

const BackupLogSchema = new Schema<IBackupLog>({
  executionDate: { type: Date, required: true, default: Date.now },
  weekday: { type: String, required: true },
  targetDatabase: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['success', 'failed', 'in_progress'], 
    required: true,
    default: 'in_progress'
  },
  sourceFile: { type: String },
  fileSize: { type: Number },
  errorMessage: { type: String },
  executedBy: { type: String, required: true },
  validationResult: {
    collectionsCount: { type: Number },
    documentsCount: { type: Number },
    isValid: { type: Boolean }
  },
  duration: { type: Number },
  backupType: { 
    type: String, 
    enum: ['daily', 'monthly'], 
    required: true,
    default: 'daily'
  },
  monthlySnapshot: { type: String }
}, {
  timestamps: true
});

BackupLogSchema.index({ executionDate: -1 });
BackupLogSchema.index({ status: 1 });
BackupLogSchema.index({ targetDatabase: 1 });

export default mongoose.models.BackupLog || mongoose.model<IBackupLog>('BackupLog', BackupLogSchema);
