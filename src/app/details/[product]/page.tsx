import { notFound } from "next/navigation";

import { Container } from "./styles";

import { getProductByName } from "@/database/services/productsService"; 

import { Header } from "@/components/Header";
import { ImageSlider } from "@/components/ImageSlider";
import { SpecsList } from "@/components/SpecsList";
import { BudgetButton } from "@/components/BudgetButton";

type PageProps = {
    params: Promise<{
        product: string
    }>
}


export default async function ProductDetailsPage({ params }: PageProps) {
    const { product } = await params;
    const productName = decodeURIComponent(product);

    const productResponse = await getProductByName(productName);

    // Usar imagens reais do produto ou imagem padrão
    const images = productResponse.images?.length 
        ? productResponse.images.map((src: string, i: number) => ({ src, alt: `${productResponse.name} - ${i + 1}` }))
        : [{ src: "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png", alt: productResponse.name }];

    // Converter especificações do banco para formato da lista
    const specs = productResponse.specifications && Object.keys(productResponse.specifications).length > 0
        ? Object.entries(productResponse.specifications).map(([key, value]) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: String(value)
          }))
        : [
            { label: "Material", value: "—" },
            { label: "Dimensões", value: "—" },
            { label: "Peso", value: "—" },
          ];

    if (!product) {
        return notFound();
    }



    return (
        <Container>
            <Header />

            <main>
                <h1>{productResponse.name}</h1>

                <p>{productResponse.description ?? "Sem descrição cadastrada"}</p>

                
                <div className="wrapper-images-specs">
                    <ImageSlider items={images} height={400} />
                    
                    <SpecsList items={specs} />
                </div>
            </main>

            <footer>
                <BudgetButton href="https://wa.me/5511982240551?text=Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20do%20site" />
            </footer>
        </Container>
    )
}