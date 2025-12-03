'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MdPhone, MdPlace, MdMail } from 'react-icons/md';

import { Container, Counter, WorktimeWrapper } from "./styles";

import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { CategoryCard } from "@/components/CategoryCard";
import { InformationCard } from "@/components/InformationCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FeaturedProducts } from "@/components/FeaturedProducts";

import tizeckFront from '@/assets/TizeckFront.jpg';
import logoTizeck from '@/assets/LogoTizeck.png';

type Category = {
    name: string;
    image: string;
};

const categoryLabels: Record<string, string> = {
    "Bomba": "Bombas",
    "Suporte MAX": "Suporte MAX",
    "Suporte Master": "Suporte Master",
    "Suporte Quadrado": "Suportes Quadrados",
    "Suporte Redondo": "Suportes Redondos",
    "Torneira": "Torneiras"
};

const categoryDescriptions: Record<string, string> = {
    "Bomba": "Linha completa de bombas para diversos tipos de aplicações.",
    "Suporte MAX": "Suportes MAX com alta resistência e durabilidade.",
    "Suporte Master": "Suportes Master com design moderno e funcional.",
    "Suporte Quadrado": "Suportes quadrados disponíveis em diversas cores e tamanhos.",
    "Suporte Redondo": "Suportes redondos com acabamento de qualidade superior.",
    "Torneira": "Torneiras práticas e duráveis para diversos usos."
};

export default function HomePage() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(() => setCategories([]));
    }, []);

    return(
        <Container>
            <Header />
            <WhatsAppButton />

            <main>
                <section className="hero">
                    <div className="wrapper-text">
                        <Image src={logoTizeck} alt="Logo Tizeck" width={400} height={160} priority style={{ margin: '0 auto 1rem' }} />
                        <h1>Excelência em Produtos</h1>

                        <p>Há mais de 20 anos no mercado, oferecemos soluções de qualidade com compromisso e inovação</p>
                    </div>

                    <div className="wrapper-buttons">
                        <Button title="Fale no WhatsApp" href="https://wa.link/pp0z8u" />
                        <Button title="Ver Produtos" isDark href="#categories" />
                    </div>

                    <span className="arrow">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <line x1="12" y1="4"  x2="12" y2="16" />
                            <polyline points="7,12 12,18 17,12" />
                        </svg>
                    </span>
                </section>

                <FeaturedProducts />

                <section className="about" id="about">
                    <div className="wrapper-title-text">
                        <h2>Sobre a Tizeck</h2>
                        <p>Uma trajetória de sucesso construída com dedicação, qualidade e compromisso com nossos clientes e parceiros</p>
                    </div>

                    <div className="wrapper-history">
                        <h3>Nossa História</h3>
                        <p>Fundada em 2008, a Tizeck nasceu da paixão e determinação de um jovem que começou aos 12 anos trabalhando em ferramentaria. O interesse pelo setor de injeção plástica surgiu após contato com um amigo da família, quando começou a vender peças produzidas por uma pequena máquina adquirida em parceria.</p>
                        <p>Com esforço e dedicação, as vendas cresceram de 2 mil para mais de 30 mil peças mensais. Aos 21 anos, investiu o dinheiro da venda de um imóvel herdado na compra de sua própria máquina, iniciando o negócio de forma independente. Buscando aperfeiçoamento, formou-se em um curso técnico em plásticos, o que impulsionou o crescimento da empresa.</p>
                        <p>Hoje, somos reconhecidos pela qualidade, tradição familiar e pelos valores que nos guiam: dedicação, inovação e excelência. Oferecemos soluções plásticas que simplificam o cotidiano com preços acessíveis.</p>
                    </div>

                    <div className="wrapper-counters">
                        <Counter>
                            <span>+16</span>
                            <p>Anos de Experiência</p>
                        </Counter>

                        <Counter>
                            <span>+500</span>
                            <p>Clientes Satisfeitos</p>
                        </Counter>
                    </div>

                    <div className="wrapper-image">
                        <Image src={tizeckFront} alt="Fachada da Tizeck" />
                    </div>
                </section>

                <section className="categories" id="categories">
                    <div className="wrapper-title-text">
                        <h2>Nossas Categorias de Produtos</h2>
                        <p>Conheça nossa linha completa de produtos desenvolvidos com tecnologia e qualidade superior</p>
                    </div>

                    <div className="wrapper-categories">
                        {categories.map((category) => (
                            <CategoryCard 
                                key={category.name}
                                name={categoryLabels[category.name] || category.name}
                                description={categoryDescriptions[category.name] || ""}
                                imageUrl={category.image}
                                href={`/products/${encodeURIComponent(category.name)}`}
                            />
                        ))}
                    </div>
                </section>

                <section className="contact">
                    <div className="wrapper-text">
                        <h1>Entre em Contato</h1>

                        <p>Estamos prontos para atender você! Fale conosco e descubra como podemos ajudar.</p>
                    </div>

                    <div className="contact-info">
                        <h3>Informações de Contato</h3>

                        <InformationCard 
                            icon={MdPlace}
                            title="Endereço"
                            information={`Rua Izabel de Andrade Maia, 315\nFerrazopólis - SBC - SP\nCEP: 09790-430`}
                        />

                        <InformationCard 
                            icon={MdPhone}
                            title="Telefone"
                            information={["(11) 98782-2169", "(11) 4067-4561"]}
                        />

                        <InformationCard 
                            icon={MdMail}
                            title="E-mail"
                            information={["tizeckwebsite@gmail.com", "contato@tizeck.com"]}
                        />
                    </div>

                    <div className="worktime">
                        <h3>Horário de Funcionamento</h3>

                        <WorktimeWrapper>
                            <div className="wrapper-day-hour">
                                <span className="day">Segunda a Sexta</span>
                                <span className="hour">08:00 - 18:00</span>
                            </div>

                            <div className="wrapper-day-hour">
                                <span className="day">Sábado</span>
                                <span className="hour">08:00 - 12:00</span>
                            </div>

                            <div className="wrapper-day-hour">
                                <span className="day">Domingo</span>
                                <span className="hour">Fechado</span>
                            </div>
                        </WorktimeWrapper>

                        <Button title="Solicitar Orçamento" href="https://wa.link/pp0z8u" />
                    </div>
                </section>
            </main>
        </Container>
    )
}