import { Schema, models, model } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  activated: {
    type: Boolean,
    default: true,
  },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;