import styled, { keyframes } from 'styled-components';
import { up } from '@/styles/media';

const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

export const Container = styled.a`
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;

    padding: 1.2rem;
    min-width: 5.6rem;
    min-height: 5.6rem;
    
    background: #25D366;
    color: white;
    
    border-radius: 50%;
    border: none;
    
    font-size: 1.4rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    text-decoration: none;
    
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    
    cursor: pointer;
    transition: all 0.3s ease;
    
    animation: ${pulse} 2s infinite;

    &:hover {
        transform: scale(1.05);
        background: #20BA5A;
    }

    span {
        display: none;
        white-space: nowrap;
    }

    @media (min-width: 480px) {
        padding: 1.4rem 2rem;
        border-radius: 5rem;
        min-width: auto;
        min-height: auto;
        font-size: 1.6rem;
        gap: 1rem;

        span {
            display: block;
        }
    }

    @media (min-width: 768px) {
        bottom: 2rem;
        right: 2rem;
    }
`;
