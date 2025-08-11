import { FaWhatsapp } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { MdBusiness, MdMail } from 'react-icons/md';

import { Container } from "./styles";

import { Header } from "@/components/Header";
import { Button } from "@/components/Button";


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

                    <div className="wrapper-buttons">
                        <Button title="Conheça Nossos Produtos"/>
                        <Button title="Sobre a Empresa" isDark />
                    </div>

                    <span className="arrow">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <line x1="12" y1="4"  x2="12" y2="16" />
                            <polyline points="7,12 12,18 17,12" />
                        </svg>
                    </span>
                </section>

                <section className="about">
                    <div className="wrapper-title-text">
                        <h2>Sobre a Tizeck</h2>
                        <p>Uma trajetória de sucesso construída com dedicação, qualidade e compromisso com nossos clientes e parceiros</p>
                    </div>

                    <div className="wrapper-history">
                        <h3>Nossa História</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ratione voluptates at omnis eos, corporis soluta dicta explicabo ipsa harum repudiandae voluptatem amet mollitia a nostrum, perferendis quaerat culpa laborum.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi magni laborum corporis. Culpa illum nihil ipsum. Perspiciatis aut aperiam maiores laborum maxime dolorum molestias nulla quo et? Totam, fugiat repellendus.</p>
                    </div>

                    <div className="wrapper-counters-image">
                    
                    </div>
                </section>
            </main>
        </Container>
    )
}