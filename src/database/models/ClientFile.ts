import { Schema, models, model } from "mongoose";

const ClientFileSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClientFile = models.ClientFile || model("ClientFile", ClientFileSchema);

export default ClientFile;
