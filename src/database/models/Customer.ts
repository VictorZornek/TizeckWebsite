import { Schema, models, model } from "mongoose";

const CustomerSchema = new Schema({
  legacyId: Number,
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  cpfCnpj: String,
  createdAt: { type: Date, default: Date.now },
});

const Customer = models.Customer || model("Customer", CustomerSchema);

export default Customer;
