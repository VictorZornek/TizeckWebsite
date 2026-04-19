import mongoose from "mongoose";

const PaymentConditionSchema = new mongoose.Schema({
  legacyId: { type: Number, required: true, unique: true },
  name: String,
  installments: Number,
}, { timestamps: true });

export default mongoose.models.PaymentCondition || mongoose.model("PaymentCondition", PaymentConditionSchema);
