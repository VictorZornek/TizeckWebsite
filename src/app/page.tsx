import { FaWhatsapp } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { MdBusiness, MdMail } from 'react-icons/md';

import { Container } from "./styles";

import { ButtonLinktree } from "@/components/ButtonLinktree";
import { Header } from "@/components/Header";

import logoTizeck from '@/assets/LogoTizeck.png'


export default function HomePage() {
    return(
        <Container>
            <Header />

            <main>
                <section className="hero">
                    <div className="wrapper-text">
                        <h1>Excelência em Produtos</h1>

                        <p>Há mais de 20 anos no mercado, oferecemos soluções de qualidade com compromisso e inovação</p>
                    </div>

                </section>
            </main>
        </Container>
    )
}