import mongoose from "mongoose";

const CompanySettingsSchema = new mongoose.Schema({
  legacyId: { type: Number, required: true, unique: true },
  companyName: String,
  tradeName: String,
  address: String,
  neighborhood: String,
  city: String,
  state: String,
  zipCode: String,
  cnpj: String,
  stateRegistration: String,
  phone1: String,
  phone2: String,
  fax: String,
  email: String,
  website: String,
  iss: Number,
  footerMessage: String,
  logo: String,
  activeItemsPurchasedByCustomer: String,
  activeBarcode: String,
  paymentMethod: String,
  orderScreen: String,
}, { timestamps: true });

export default mongoose.models.CompanySettings || mongoose.model("CompanySettings", CompanySettingsSchema);
