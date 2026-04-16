import mongoose from "mongoose";

const JobFunctionSchema = new mongoose.Schema({
  legacyId: { type: Number, required: true, unique: true },
  name: String,
}, { timestamps: true });

export default mongoose.models.JobFunction || mongoose.model("JobFunction", JobFunctionSchema);
