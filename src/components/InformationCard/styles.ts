import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    @media (min-width: 768px) {
        gap: 1.2rem;
    }
`;

export const IconBox = styled.div`
    width: 3.5rem;
    height: 3.5rem;
    min-height: 3.5rem;
    min-width: 3.5rem;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border-radius: .8rem;

    background: ${({ theme }) => theme.COLORS.BLUE};
    color: ${({ theme }) => theme.COLORS.WHITE_900};

    svg {
        width: 2rem;
        height: 2rem;
    }

    @media (min-width: 768px) {
        width: 4rem;
        height: 4rem;
        min-height: 4rem;
        min-width: 4rem;

        svg {
            width: 2.2rem;
            height: 2.2rem;
        }
    }
`;

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: .3rem;
    flex: 1;

    @media (min-width: 768px) {
        gap: .4rem;
    }
`;

export const Title = styled.h4`
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};
    font-size: 1.4rem;
    line-height: 1.3;
    margin: 0;

    color: ${({ theme }) => theme.COLORS.WHITE_900};

    @media (min-width: 768px) {
        font-size: 1.5rem;
    }
`;

export const Line = styled.p`
    font-size: 1.3rem;
    line-height: 1.5;
    margin: 0;

    color: ${({ theme }) => theme.COLORS.GRAY_400};

    white-space: pre-line;

    @media (min-width: 768px) {
        font-size: 1.4rem;
        line-height: 1.5;
    }
`;