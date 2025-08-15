import { Container } from "./styles"

import { listProductsByCategory } from "@/database/services/productsService"

import { Header } from "@/components/Header"
import { ProductCard } from "@/components/ProductCard"
import { ImageSlider } from "@/components/ImageSlider"
import { SpecsList } from "@/components/SpecsList"

type PageProps = { 
    params: Promise<{ 
        category: string 
    }>
};

export default async function ProductsPage({ params }: PageProps) {
    const { category } = await params;
    const categoryName = decodeURIComponent(category);
    
    const products = await listProductsByCategory(categoryName);

    const imgs = [
        { src: 'https://picsum.photos/seed/a/1200/800', alt: 'Slide A' },
        { src: 'https://picsum.photos/seed/b/1200/800', alt: 'Slide B' },
        { src: 'https://picsum.photos/seed/c/1200/800', alt: 'Slide C' },
    ];

    const specs = [
        { label: 'Material',   value: 'Aço inoxidável' },
        { label: 'Dimensões',  value: '25 x 15 x 30 cm' },
        { label: 'Peso',       value: '1.2 kg' },
        { label: 'Acabamento', value: 'Polido'}
    ];

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
                                imageUrl={product.images?.[0] || "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"}
                            />
                        </div>
                    ))}
                </div>

                <ImageSlider items={imgs} autoPlay interval={4500} height={300} />

                <SpecsList items={specs} />
            </main>
        </Container>
    )
}