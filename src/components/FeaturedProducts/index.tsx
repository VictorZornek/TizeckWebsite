'use client';

import { ProductCard } from '../ProductCard';
import { Container } from './styles';

const featuredProducts = [
    {
        name: "Suporte Quadrado Premium",
        imageUrl: "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png",
        href: "/details/Suporte%20Quadrado%20Premium"
    },
    {
        name: "Filtro Avançado",
        imageUrl: "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png",
        href: "/details/Filtro%20Avançado"
    },
    {
        name: "Torneira Moderna",
        imageUrl: "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png",
        href: "/details/Torneira%20Moderna"
    }
];

export function FeaturedProducts() {
    return (
        <Container>
            <div className="wrapper-title">
                <h2>Produtos em Destaque</h2>
                <p>Conheça nossos produtos mais procurados</p>
            </div>

            <div className="products-grid">
                {featuredProducts.map((product) => (
                    <ProductCard
                        key={product.name}
                        name={product.name}
                        imageUrl={product.imageUrl}
                        href={product.href}
                    />
                ))}
            </div>
        </Container>
    );
}
