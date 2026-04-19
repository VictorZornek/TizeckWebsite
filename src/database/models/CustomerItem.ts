import mongoose from "mongoose";

const CustomerItemSchema = new mongoose.Schema({
  customerCode: { type: Number, required: true },
  itemCode: { type: Number, required: true },
  quantity: Number,
  value: Number,
  date: Date,
  userCode: Number,
  discount: Number,
  tableUsed: Number,
}, { timestamps: true });

CustomerItemSchema.index({ customerCode: 1, itemCode: 1, date: 1 });

export default mongoose.models.CustomerItem || mongoose.model("CustomerItem", CustomerItemSchema);
