import { Schema, models, model } from "mongoose";

const CustomerSchema = new Schema({
  legacyId: Number,
  name: { type: String, required: true },
  fantasyName: String,
  email: String,
  phone: String,
  phone2: String,
  address: String,
  number: String,
  neighborhood: String,
  city: String,
  state: String,
  zipCode: String,
  cpfCnpj: String,
  stateRegistration: String,
  rg: String,
  contact: String,
  department: String,
  personType: String,
  birthDate: Date,
  notes: String,
  blocked: String,
  type: String,
  regionCode: Number,
  vendorCode: Number,
  tablePrice: Number,
  deliveryAddress: String,
  deliveryCity: String,
  deliveryNeighborhood: String,
  deliveryState: String,
  deliveryZipCode: String,
  createdAt: { type: Date, default: Date.now },
});

const Customer = models.Customer || model("Customer", CustomerSchema);

export default Customer;
