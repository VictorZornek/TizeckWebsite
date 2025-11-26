import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

export const Container = styled.a`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;

    display: flex;
    align-items: center;
    gap: 1rem;

    padding: 1.4rem 2rem;
    
    background: #25D366;
    color: white;
    
    border-radius: 5rem;
    border: none;
    
    font-size: 1.6rem;
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
        @media (max-width: 480px) {
            display: none;
        }
    }
`;
