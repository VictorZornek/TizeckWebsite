import { FaWhatsapp } from 'react-icons/fa';
import { Container } from './styles';

export function WhatsAppButton() {
    return (
        <Container
            href="https://wa.link/pp0z8u"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco pelo WhatsApp"
        >
            <FaWhatsapp size={28} />
            <span>Fale Conosco</span>
        </Container>
    );
}
