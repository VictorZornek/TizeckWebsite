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

    if (!product) {
        return notFound();
    }

    const images: { src: string; alt: string }[] = productResponse.images?.length 
        ? productResponse.images.map((src: string, i: number) => ({ src, alt: `${productResponse.name} - ${i + 1}` }))
        : [{ src: "https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png", alt: productResponse.name }];

    const specs = productResponse.specs?.length
        ? productResponse.specs
        : [
            { label: "Material", value: "—" },
            { label: "Dimensões", value: "—" },
            { label: "Peso", value: "—" },
        ];

    return (
        <Container>
            <Header />

            <main>
                <h1>{productResponse.name}</h1>

                <h3>{productResponse.description ?? "Sem descrição cadastrada"}</h3>

                
                <div>
                    <ImageSlider items={images} />
                    
                    <SpecsList items={specs} />

                    <BudgetButton />
                </div>
            </main>
        </Container>
    )
}