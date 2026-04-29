import { connectMongo } from '@/database/db';
import Product from '@/database/models/Product';
import { FeaturedProductsClient } from './client';

type ProductType = {
    name: string;
    images?: string[];
};

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

export async function FeaturedProducts() {
    const products = await getFeaturedProducts();
    return <FeaturedProductsClient products={products} />;
}
