import { Schema, models, model } from "mongoose";

const OrderSchema = new Schema({
  legacyId: Number,
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  orderDate: Date,
  totalAmount: Number,
  status: String,
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: "Products" },
    productName: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
  }],
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
