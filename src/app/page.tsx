import { connectMongo } from '@/database/db';
import Category from '@/database/models/Category';
import Product from '@/database/models/Product';
import { HomeClient } from './HomeClient';

type CategoryType = {
    _id: string;
    name: string;
    description: string;
    image: string;
    activated: boolean;
};

type ProductType = {
    name: string;
    images?: string[];
};

async function getCategories(): Promise<CategoryType[]> {
    try {
        await connectMongo();
        const categories = await Category.find({ activated: true }).lean();
        return categories.map(cat => ({
            _id: (cat._id as { toString: () => string }).toString(),
            name: cat.name as string,
            description: cat.description as string,
            image: cat.image as string,
            activated: cat.activated as boolean,
        }));
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return [];
    }
}

async function getFeaturedProducts(): Promise<ProductType[]> {
    try {
        await connectMongo();
        const products = await Product.find({ featured: true, activated: true })
            .select('name images')
            .limit(6)
            .lean();
        return products.map(p => ({
            name: p.name as string,
            images: p.images as string[] | undefined,
        }));
    } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        return [];
    }
}

export default async function HomePage() {
    const [categories, featuredProducts] = await Promise.all([
        getCategories(),
        getFeaturedProducts(),
    ]);

    return <HomeClient categories={categories} featuredProducts={featuredProducts} />;
}