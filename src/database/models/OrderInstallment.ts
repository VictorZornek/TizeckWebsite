import mongoose from "mongoose";

const OrderInstallmentSchema = new mongoose.Schema({
  orderCode: { type: Number, required: true },
  installmentCode: { type: Number, required: true },
  dueDate: Date,
  paymentDate: Date,
  installmentValue: Number,
  paymentValue: Number,
  status: String,
  paymentMethod: String,
  operatorCode: Number,
  document: Number,
}, { timestamps: true });

OrderInstallmentSchema.index({ orderCode: 1, installmentCode: 1 }, { unique: true });

export default mongoose.models.OrderInstallment || mongoose.model("OrderInstallment", OrderInstallmentSchema);
