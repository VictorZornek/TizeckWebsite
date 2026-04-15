import { Schema, models, model } from "mongoose";

const ImportHistorySchema = new Schema({
  fileName: String,
  importDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["success", "error", "partial"], default: "success" },
  stats: {
    customers: { imported: Number, errors: Number },
    products: { imported: Number, errors: Number },
    orders: { imported: Number, errors: Number },
  },
  errors: [String],
});

const ImportHistory = models.ImportHistory || model("ImportHistory", ImportHistorySchema);

export default ImportHistory;
