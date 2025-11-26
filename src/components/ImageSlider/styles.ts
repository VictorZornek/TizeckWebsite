import styled, { css } from "styled-components";

export const Container = styled.div`
    position: relative;
    width: 100%;

    margin: 0 auto;

    border-radius: 1.2rem;

    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 255, 0.95) 100%);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);

    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    overflow: hidden;
`;

export const Viewport = styled.div`
    position: relative;

    height: calc(100% - 4.5rem); /* deixa espaço para a barra inferior */
    padding: 0 6.4rem;           /* espaço para as setas laterais */

    display: flex;
    align-items: center;

    overflow: hidden;
    outline: none;
`;

export const Track = styled.div`
    display: flex;
    width: 100%;
    height: 100%;

    transition: transform 360ms ease;
    will-change: transform;
`;

export const Slide = styled.div`
    flex: 0 0 100%;
    height: 100%;

    display: grid;
    place-items: center;
`;

export const Image = styled.img`
    max-width: min(80%, 26.5rem);
    max-height: 90%;

    object-fit: contain;

    border-radius: 1.4rem;

    box-shadow: 0 6px 20px rgba(31, 73, 215, 0.12);
`;

export const ArrowButton = styled.button<{ side: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    ${(p) => (p.side === 'left' ? 'left: 16px;' : 'right: 16px;')}
    transform: translateY(-50%);

    width: 4.2rem;
    height: 4.2rem;

    border-radius: 1rem;
    border: none;

    background: linear-gradient(135deg, #1E43B1 0%, #2563eb 100%);
    color: ${({ theme }) => theme.COLORS.WHITE_900};
    box-shadow: 0 6px 16px rgba(30, 67, 177, 0.4);

    display: grid;
    place-items: center;

    z-index: 1;

    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        transform: translateY(-50%) scale(1.1);
        box-shadow: 0 8px 20px rgba(30, 67, 177, 0.6);
    }

    &:disabled {
        opacity: 0.4;
        cursor: default;
    }

    &:focus-visible {
        outline: 3px solid rgba(30, 67, 177, 0.6);
        outline-offset: 2px;
    }
`;

export const BottomBar = styled.div`
    height: 4.5rem;
    background: ${({ theme }) => theme.COLORS.WHITE_900}; /* faixa clara como no mock */
    
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

export const Dot = styled.button<{ $active?: boolean }>`
    width: .9rem;
    height: .9rem;

    border-radius: 50%;
    border: none;

    cursor: pointer;

    background: #c9cdd6;
    transition: transform 160ms ease, background 160ms ease;

    ${({ $active }) =>
        $active &&
        css`
            transform: scale(1.15);
            background: linear-gradient(135deg, #1E43B1 0%, #2563eb 100%);
        `}

    &:focus-visible {
        outline: 2px solid rgba(30, 67, 177, 0.6);
        outline-offset: 2px;
    }
`;


export const SrOnly = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;

    margin: -1px;
    border: none;

    overflow: hidden;
    clip: rect(0, 0, 0, 0);
`;