import { FaWhatsapp } from 'react-icons/fa';
import { Container } from './styles';

export function WhatsAppButton() {
    return (
        <Container
            href="https://wa.me/5511987822169?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20produtos"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco pelo WhatsApp"
        >
            <FaWhatsapp size={28} />
            <span>Fale Conosco</span>
        </Container>
    );
}
