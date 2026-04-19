import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  legacyId: { type: Number, required: true, unique: true },
  userId: Number,
  name: String,
  rg: String,
  cpf: String,
  positionCode: Number,
  shortName: String,
  active: String,
  address: String,
  neighborhood: String,
  city: String,
  state: String,
  info: String,
  birthDate: Date,
  phone: String,
  mobile: String,
  functionCode: Number,
  commission1: Number,
  commission2: Number,
  commission3: Number,
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
