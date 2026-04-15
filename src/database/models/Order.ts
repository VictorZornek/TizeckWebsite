import { Schema, models, model } from "mongoose";

const OrderSchema = new Schema({
  legacyId: Number,
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  customerLegacyId: Number,
  orderDate: Date,
  vendorCode: Number,
  status: String,
  conditionCode: Number,
  tablePrice: Number,
  discountPercent: Number,
  discount: Number,
  totalItems: Number,
  totalAmount: Number,
  notes: String,
  deliveryDate: Date,
  invoiceNumber: String,
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: "Products" },
    productName: String,
    legacyProductCode: Number,
    quantity: Number,
    unitPrice: Number,
    discount: Number,
    costPrice: Number,
    totalPrice: Number,
  }],
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
