'use client'

import { Container } from "./styles"

import { Header } from "@/components/Header"
import { CategoryCard } from "@/components/CategoryCard"

export default function CategoriesPage() {
    return(
        <Container>
            <Header />

            <main>
                <div className="wrapper-categories">
                    <CategoryCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/SuporteRedondo.png" name="Suportes" />
                    <CategoryCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/acessorios_galoes/BombaManualGalao.png" name="Acessórios Galões" />
                </div>
            </main>
        </Container>
    )
}