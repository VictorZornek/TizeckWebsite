import { Schema, models, model } from "mongoose";

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Client = models.Client || model("Client", ClientSchema);

export default Client;
