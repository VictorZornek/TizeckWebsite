import { connectMongo } from "@/database/db";
import Products from "@/database/models/Product";
import Category from "@/database/models/Category";

export async function listCategories() {
    await connectMongo();

    // Pega os valores distintos do campo "category"
    const categories = await Products.distinct("category");

    return categories;
}

export async function listProductsByCategory(category: string) {
    await connectMongo();

    const products = await Products.find({ category });

    return products;
}

export async function getProductByName(name: string) {
    await connectMongo();

    const product = await Products.findOne({ name });

    return product;
}

export async function getFeaturedProducts() {
    await connectMongo();

    const products = await Products.find({
        name: { $in: ["Suporte Quadrado Branco", "Suporte Redondo Branco", "Suporte Quadrado Preto"] }
    }).limit(3);

    return products;
}

export async function getCategoriesWithImages() {
    await connectMongo();

    // Buscar categorias do banco de dados
    const categories = await Category.find({ activated: true }).sort({ name: 1 });
    
    return categories.map(cat => ({
        _id: cat._id,
        name: cat.name,
        description: cat.description,
        image: cat.image,
        activated: cat.activated
    }));
}

