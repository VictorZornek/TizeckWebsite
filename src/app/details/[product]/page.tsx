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

    const imgs = [
        { src: 'https://picsum.photos/seed/a/1200/800', alt: 'Slide A' },
        { src: 'https://picsum.photos/seed/b/1200/800', alt: 'Slide B' },
        { src: 'https://picsum.photos/seed/c/1200/800', alt: 'Slide C' },
    ];

    const specsMock = [
        { label: 'Material',   value: 'Aço inoxidável' },
        { label: 'Dimensões',  value: '25 x 15 x 30 cm' },
        { label: 'Peso',       value: '1.2 kg' },
        { label: 'Acabamento', value: 'Polido'}
    ];

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

                <p>{productResponse.description ?? "Sem descrição cadastrada"}</p>

                
                <div className="wrapper-images-specs">
                    <ImageSlider items={imgs} height={300} />
                    
                    <SpecsList items={specsMock} />
                </div>
            </main>

            <footer>
                <BudgetButton />
            </footer>
        </Container>
    )
}