import styled from "styled-components";

export const Container = styled.div`
    width: 100%;

    border-radius: 1.2rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 255, 0.95) 100%);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);

    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    padding: 2rem 0 .8rem;
`;

export const Title = styled.h3`
    margin: 0 1.6rem .8rem;

    text-align: center;
    font-family: var(--font-inter, inherit);
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};

    background: linear-gradient(135deg, #1E43B1 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

export const List = styled.dl`
    margin: 0;
    padding: 0 1.6rem .8rem;
`;

export const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.6rem;

    padding: 1.4rem 1rem;
    margin: 0 0.5rem;
    border-radius: 0.8rem;

    border-top: .5px solid rgba(30, 67, 177, 0.2);
    transition: all 0.3s ease;

    &:first-of-type {
        border-top: none;
    }

    &:hover {
        background: linear-gradient(90deg, rgba(30, 67, 177, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
        transform: translateX(5px);
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 6px;
    }
`;

export const Label = styled.dt`
    margin: 0;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.COLORS.GRAY_700};
`;

export const Value = styled.dd`
    margin: 0;

    font-size: 1.6rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    text-align: center;

    background: linear-gradient(135deg, #1E43B1 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 480px) {
        text-align: left;
    }
`;

export const ValueLink = styled.a`
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid currentColor;

    &:hover {
        opacity: 0.9;
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.COLORS.BLUE};
        outline-offset: 2px;
    }
`;