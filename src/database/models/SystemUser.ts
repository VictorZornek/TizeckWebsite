import mongoose from "mongoose";

const SystemUserSchema = new mongoose.Schema({
  legacyId: { type: Number, required: true, unique: true },
  username: String,
  password: String,
  employeeCode: Number,
}, { timestamps: true });

export default mongoose.models.SystemUser || mongoose.model("SystemUser", SystemUserSchema);
