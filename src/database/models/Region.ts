import mongoose from "mongoose";

const RegionSchema = new mongoose.Schema({
  legacyId: { type: Number, required: true, unique: true },
  name: String,
  tax: Number,
}, { timestamps: true });

export default mongoose.models.Region || mongoose.model("Region", RegionSchema);
