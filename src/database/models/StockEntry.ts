import mongoose from "mongoose";

const StockEntrySchema = new mongoose.Schema({
  entryCode: { type: Number, required: true },
  itemCode: { type: Number, required: true },
  quantity: Number,
  productCode: Number,
  entryDate: Date,
}, { timestamps: true });

StockEntrySchema.index({ entryCode: 1, itemCode: 1 }, { unique: true });

export default mongoose.models.StockEntry || mongoose.model("StockEntry", StockEntrySchema);
