import { FaWhatsapp } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { MdBusiness, MdMail } from 'react-icons/md';

import { Cinzel } from 'next/font/google'; 

import { Container } from "./styles";

import { ButtonLinktree } from "@/components/ButtonLinktree";

const cinzel = Cinzel({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    display: 'swap',
});

export default function HomePage() {
    return(
        <Container>
            <h1 className={cinzel.className}>Seja muito bem-vindo(a)!</h1>

            <div className='wrapper-buttons'>
                <ButtonLinktree icon={<GrCatalog />} title="Catálogo Produtos" />
                <ButtonLinktree icon={<MdBusiness />} title="Sobre a Tizeck" />        
                <ButtonLinktree icon={<FaWhatsapp />} title="Whatsapp" />
                <ButtonLinktree icon={<MdMail />} title="E-mail" />
            </div>
        </Container>
    )
}