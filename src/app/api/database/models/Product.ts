import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    images: {
        type: [String],
        default: []
    },

    activated: { 
        type: Boolean, 
        default: true 
    },

    specifications: {
        type: Schema.Types.Mixed,
        default: {}
    }
});

const Products = models.Products || model('Products', ProductSchema);

export default Products;