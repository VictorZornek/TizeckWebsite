import styled from "styled-components";

export const Container = styled.div`
    width: 100%;

    border-radius: 1.2rem;

    box-shadow: 0 2px 12px rgba(16, 24, 40, 0.04);
    padding: 2rem 0 .8rem;
`;

export const Title = styled.h3`
    margin: 0 1.6rem .8rem;

    text-align: center;
    font-family: var(--font-inter, inherit);
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};

    color: ${({ theme }) => theme.COLORS.DARK_BLUE};
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

    padding: 1.4rem 0;

    border-top: .5px solid ${({ theme }) => theme.COLORS.GRAY_300};

    &:first-of-type {
        border-top: none;
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

    color: ${({ theme }) => theme.COLORS.DARK_BLUE};

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