import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  legacyId: { type: Number, required: true, unique: true },
  installmentCode: Number,
  customerSupplierCode: Number,
  issueDate: Date,
  dueDate: Date,
  paymentDate: Date,
  vendorCode: Number,
  checkNumber: String,
  conditionCode: Number,
  accountNumber: String,
  history: String,
  accountType: String,
  installmentValue: Number,
  paidValue: Number,
  debit: Number,
  realDebit: Number,
  discount: Number,
  paymentType: String,
  operatorCode: Number,
  closedDate: Date,
  commission: String,
  commissionPaymentDate: Date,
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
