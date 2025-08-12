import { Container } from "./styles"

import { Header } from "@/components/Header"
import { CategoryCard } from "@/components/CategoryCard"

export default function CategoriesPage() {
    return(
        <Container>
            <Header />

            <main>
                <h1>Categorias de Produtos</h1>
                
                <div className="wrapper-categories">
                    <CategoryCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suportes" />
                    <CategoryCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/acessorios_galoes/CapaAcessorios.png" name="Acessórios Galões" />
                    <CategoryCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suportes" />
                    <CategoryCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/acessorios_galoes/CapaAcessorios.png" name="Acessórios Galões" />
                    <CategoryCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png" name="Suportes" />
                    <CategoryCard imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/acessorios_galoes/CapaAcessorios.png" name="Acessórios Galões" />
                </div>
            </main>
        </Container>
    )
}