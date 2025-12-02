import styled, { css } from "styled-components";

export const Container = styled.div`
    position: relative;
    width: 100%;
    max-width: 50rem;
    aspect-ratio: 1 / 1;

    margin: 0 auto;

    border-radius: 2rem;

    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

export const Viewport = styled.div`
    position: relative;

    height: calc(100% - 5rem);
    padding: 1rem 6rem;

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
    max-width: 90%;
    max-height: 90%;

    object-fit: contain;

    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
`;

export const ArrowButton = styled.button<{ side: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    ${(p) => (p.side === 'left' ? 'left: 1.5rem;' : 'right: 1.5rem;')}
    transform: translateY(-50%);

    width: 4rem;
    height: 4rem;

    border-radius: 50%;
    border: none;

    background: rgba(255, 255, 255, 0.9);
    color: #1E43B1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    display: grid;
    place-items: center;

    z-index: 2;

    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        transform: translateY(-50%) scale(1.1);
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    &:disabled {
        opacity: 0.3;
        cursor: default;
    }

    &:focus-visible {
        outline: 3px solid rgba(30, 67, 177, 0.6);
        outline-offset: 2px;
    }
`;

export const BottomBar = styled.div`
    height: 5rem;
    background: rgba(255, 255, 255, 0.1);
    
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`;

export const Dot = styled.button<{ $active?: boolean }>`
    width: 1rem;
    height: 1rem;

    border-radius: 50%;
    border: none;

    cursor: pointer;

    background: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;

    ${({ $active }) =>
        $active &&
        css`
            width: 2.5rem;
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.9);
        `}

    &:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.8);
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