import { Container } from "./styles"

import { listProductsByCategory } from "@/database/services/productsService"

import { Header } from "@/components/Header"
import { ProductCard } from "@/components/ProductCard"

type PageProps = { 
    params: Promise<{ 
        category: string 
    }>
};

export default async function ProductsPage({ params }: PageProps) {
    const { category } = await params;
    const categoryName = decodeURIComponent(category);
    
    const products = await listProductsByCategory(categoryName);

    return(
        <Container>
            <Header />

            <main>
                <h1>Produtos de {categoryName}</h1>
                
                <div className="wrapper-products">
                    {products.map((product: any) => (
                        <div className="product-row" key={String(product._id)}>
                            <ProductCard 
                                name={product.name}
                                imageUrl={product.image?.[0] || "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </Container>
    )
}