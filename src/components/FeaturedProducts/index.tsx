'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '../ProductCard';
import { Container } from './styles';

type Product = {
    name: string;
    images?: string[];
};

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('/api/products/featured')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(() => setProducts([]));
    }, []);

    return (
        <Container>
            <div className="wrapper-title">
                <h2>Produtos em Destaque</h2>
                <p>Conheça nossos produtos mais procurados</p>
            </div>

            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.name}
                        name={product.name}
                        imageUrl={product.images?.[0] || "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"}
                        href={`/details/${encodeURIComponent(product.name)}`}
                    />
                ))}
            </div>
        </Container>
    );
}
