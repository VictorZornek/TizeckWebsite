import styled, { css } from "styled-components";

export const Container = styled.div`
    position: relative;
    width: 100%;

    border-radius: 1.2rem;

    background: ${({ theme }) => theme.COLORS.GRAY_300};

    box-shadow: 0 12px 22px rgba(0, 0, 0, 0.06) inset;
    overflow: hidden;
`;

export const Viewport = styled.div`
    position: relative;

    height: calc(100% - 4.4rem); /* deixa espaço para a barra inferior */
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
    max-width: min(76%, 78rem);
    max-height: 80%;

    object-fit: contain;
    background: ${({ theme }) => theme.COLORS.WHITE_600};

    border: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    border-radius: 1.4rem;

    padding: 1.8rem;

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

    background: ${({ theme }) => theme.COLORS.WHITE_900};
    color: ${({ theme }) => theme.COLORS.BLUE};
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

    display: grid;
    place-items: center;

    cursor: pointer;

    &:disabled {
        opacity: 0.4;
        cursor: default;
    }

    &:focus-visible {
        outline: 3px solid rgba(31, 73, 215, 0.45);
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
            background: ${({ theme }) => theme.COLORS.BLUE}; /* ativo azul */
        `}

    &:focus-visible {
        outline: 2px solid rgba(31,73,215,0.45);
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