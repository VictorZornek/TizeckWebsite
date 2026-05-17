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

    const products = await Products.find({ category, activated: true })
        .sort({
            displayOrder: 1,
            name: 1,
        })
        .select("name images")
        .lean()
        .exec();

    return products as unknown as Array<{
        _id: unknown;
        name: string;
        images?: string[];
    }>;
}

export async function getProductByName(name: string) {
    await connectMongo();

    const product = await Products.findOne({ name });

    return product;
}

export async function getFeaturedProducts() {
    await connectMongo();

    const products = await Products.find({ featured: true, activated: true })
        .sort({
            displayOrder: 1,
            name: 1,
        })
        .limit(6)
        .lean();

    return products;
}

export async function getCategoriesWithImages() {
    await connectMongo();

    // Buscar categorias do banco de dados
    const categories = await Category.find({ activated: true })
        .sort({
            displayOrder: 1,
            name: 1,
        })
        .lean();

    return categories.map((cat) => ({
        _id: String(cat._id),
        name: cat.name,
        description: cat.description,
        image: cat.image,
        activated: cat.activated,
    }));
}

