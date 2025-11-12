'use client'

import Image from 'next/image';
import { MdPhone, MdPlace, MdMail } from 'react-icons/md';

import { Container, Counter, WorktimeWrapper } from "./styles";

import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { CategoryCard } from "@/components/CategoryCard";
import { InformationCard } from "@/components/InformationCard";

import tizeckFront from '@/assets/TizeckFront.jpg';

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
                        <Button title="Conheça Nossos Produtos" href="#categories" />
                        <Button title="Sobre a Empresa" isDark href="#about" />
                    </div>

                    <span className="arrow">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <line x1="12" y1="4"  x2="12" y2="16" />
                            <polyline points="7,12 12,18 17,12" />
                        </svg>
                    </span>
                </section>

                <section className="about" id="about">
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
                        <div className='wrapper-counters'>
                            <Counter>
                                <span>+20</span>
                                <p>Anos de Experiência</p>
                            </Counter>

                            <Counter>
                                <span>+500</span>
                                <p>Clientes Satisfeitos</p>
                            </Counter>
                        </div>

                        <Image src={tizeckFront} alt="Frente da Tizeck" />
                    </div>
                </section>

                <section className="categories" id="categories">
                    <div className="wrapper-title-text">
                        <h2>Nossas Categorias de Produtos</h2>
                        <p>Conheça nossa linha completa de produtos desenvolvidos com tecnologia e qualidade superior</p>
                    </div>

                    <div className="wrapper-categories">
                        <CategoryCard 
                            name="Filtros" 
                            description="Descrição detalhada do produto, suas principais características, benefícios e aplicações no mercado." 
                            imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"
                            href={`/products/${encodeURIComponent("Filtro")}`}
                        />

                        <CategoryCard 
                            name="Suportes Quadrados" 
                            description="Descrição detalhada do produto, suas principais características, benefícios e aplicações no mercado." 
                            imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"
                            href={`/products/${encodeURIComponent("Suporte Quadrado")}`}
                        />

                        <CategoryCard 
                            name="Suportes Redondos" 
                            description="Descrição detalhada do produto, suas principais características, benefícios e aplicações no mercado." 
                            imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"
                            href={`/products/${encodeURIComponent("Suporte Redondo")}`}
                        />

                        <CategoryCard 
                            name="Torneiras" 
                            description="Descrição detalhada do produto, suas principais características, benefícios e aplicações no mercado." 
                            imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"
                            href={`/products/${encodeURIComponent("Torneira")}`}
                        />

                        <CategoryCard 
                            name="Galões" 
                            description="Descrição detalhada do produto, suas principais características, benefícios e aplicações no mercado." 
                            imageUrl="https://tizeck-products.s3.sa-east-1.amazonaws.com/suportes/CapaSuporte.png"
                            href={`/products/${encodeURIComponent("Galões")}`}
                        />
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

                        <Button title="Solicitar Orçamento" href="https://wa.me/5511987822169" />
                    </div>
                </section>
            </main>
        </Container>
    )
}