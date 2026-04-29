import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "light",
  },
});

const User = models.User || model("User", UserSchema);

export default User;