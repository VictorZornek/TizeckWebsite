'use client'

import { Container } from "./styles"

import { Header } from "@/components/Header"
import { ProductCard } from "@/components/ProductCard"

export default function ProductsPage() {
    return(
        <Container>
            <Header />

            <main>
                <h1>Produtos de Suporte</h1>

                <div className="wrapper-products">
                    <div className="products-side-to-side">
                        <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suporte Sangel"/>
                        <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suporte Sangel"/>
                    </div>
                    <div className="products-side-to-side">
                        <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suporte Sangel"/>
                        <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suporte Sangel"/>
                    </div>
                    <div className="products-side-to-side">
                        <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suporte Sangel"/>
                        <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suporte Sangel"/>
                    </div>
                </div>
            </main>
        </Container>
    )
}