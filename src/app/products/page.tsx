'use client'

import { Container } from "../styles"

import { Header } from "@/components/Header"
import { ProductCard } from "@/components/ProductCard"

export default function ProductsPage() {
    return(
        <Container>
            <Header />

            <main>
                <h1>Produtos de Suporte</h1>

                <div className="wrapper-products">
                    <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/SuporteSangel.png" name="Suporte Sangel"/>
                    <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/SuporteRedondo.png" name="Suporte Redondo"/>
                    <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/SuporteMaxi.png" name="Suporte Maxi"/>
                    <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/SuporteMaster.png" name="Suporte Master"/>
                    <ProductCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/SuporteInox.png" name="Suporte Inox"/>
                </div>
            </main>
        </Container>
    )
}