import { FaWhatsapp } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { MdBusiness, MdMail } from 'react-icons/md';

import { Container } from "./styles";

import { ButtonLinktree } from "@/components/ButtonLinktree";

import logoTizeck from '@/assets/LogoTizeck.png'


export default function HomePage() {
    return(
        <Container>
            <img src={logoTizeck.src} alt="Logo Tizeck"/>

            <h1>Seja muito bem-vindo(a)!</h1>

            <div className='wrapper-buttons'>
                <ButtonLinktree icon={<GrCatalog />} title="Catálogo Produtos" href="/categories" />
                <ButtonLinktree icon={<MdBusiness />} title="Sobre a Tizeck" />        
                <ButtonLinktree icon={<FaWhatsapp />} title="Whatsapp" />
                <ButtonLinktree icon={<MdMail />} title="E-mail" />
            </div>
        </Container>
    )
}