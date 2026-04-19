import mongoose from "mongoose";

const ConditionItemSchema = new mongoose.Schema({
  conditionCode: { type: Number, required: true },
  itemCode: { type: Number, required: true },
  daysQuantity: Number,
}, { timestamps: true });

ConditionItemSchema.index({ conditionCode: 1, itemCode: 1 }, { unique: true });

export default mongoose.models.ConditionItem || mongoose.model("ConditionItem", ConditionItemSchema);
