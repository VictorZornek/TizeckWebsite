const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

const Products = mongoose.models.Products || mongoose.model('Products', ProductSchema);

module.exports = Products;