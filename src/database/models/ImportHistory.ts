import { Schema, models, model } from "mongoose";

const ImportHistorySchema = new Schema({
  fileName: String,
  importDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["success", "error", "partial"], default: "success" },
  stats: {
    customers: { imported: Number, errors: Number, new: Number, updated: Number },
    products: { imported: Number, errors: Number, new: Number, updated: Number },
    orders: { imported: Number, errors: Number, new: Number, updated: Number },
    paymentConditions: { imported: Number, errors: Number, new: Number, updated: Number },
    accounts: { imported: Number, errors: Number, new: Number, updated: Number },
    stockEntries: { imported: Number, errors: Number, new: Number, updated: Number },
    jobFunctions: { imported: Number, errors: Number, new: Number, updated: Number },
    employees: { imported: Number, errors: Number, new: Number, updated: Number },
    regions: { imported: Number, errors: Number, new: Number, updated: Number },
    conditionItems: { imported: Number, errors: Number, new: Number, updated: Number },
    orderInstallments: { imported: Number, errors: Number, new: Number, updated: Number },
    companySettings: { imported: Number, errors: Number, new: Number, updated: Number },
    customerItems: { imported: Number, errors: Number, new: Number, updated: Number },
    systemUsers: { imported: Number, errors: Number, new: Number, updated: Number },
  },
  errors: [String],
  lastSyncDate: Date,
  processingTime: Number,
});

const ImportHistory = models.ImportHistory || model("ImportHistory", ImportHistorySchema);

export default ImportHistory;
