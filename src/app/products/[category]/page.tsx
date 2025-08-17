import { Container as PageContainer } from "./styles";
import { Container } from "@/components/Container";

import { listProductsByCategory } from "@/database/services/productsService";

import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";

type PageProps = { 
    params: Promise<{ 
        category: string 
    }>
};

type product = {
    _id: string;
    name: string;
}

export default async function ProductsPage({ params }: PageProps) {
    const { category } = await params;
    const categoryName = decodeURIComponent(category);
    
    const products = await listProductsByCategory(categoryName);

    return(
        <PageContainer>
            <Header />

            <main>
                <Container>
                    <h1>Produtos de {categoryName}</h1>

                    <div className="wrapper-products">
                        {products.map((product: product) => (
                            <div className="product-row" key={String(product._id)}>
                                <ProductCard
                                    name={product.name}
                                    // imageUrl={product.images?.[0] || "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"}
                                    imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"
                                    href={`/details/${encodeURIComponent(`${product.name}`)}`}
                                />
                            </div>
                        ))}
                    </div>
                </Container>
            </main>
        </PageContainer>
    )
}