import { ProductCard } from '../ProductCard';
import { Container } from './styles';
import { connectMongo } from '@/database/db';
import Product from '@/database/models/Product';

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

    return (
        <Container>
            <div className="wrapper-title">
                <h2>Produtos em Destaque</h2>
                <p>Conheça nossos produtos mais procurados</p>
            </div>

            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.name}
                            name={product.name}
                            imageUrl={product.images?.[0] || "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"}
                            href={`/details/${encodeURIComponent(product.name)}`}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', width: '100%', color: '#666' }}>Nenhum produto em destaque no momento</p>
                )}
            </div>
        </Container>
    );
}
