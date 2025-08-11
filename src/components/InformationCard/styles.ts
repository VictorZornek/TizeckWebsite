import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1.2rem;
`;

export const IconBox = styled.div`
    width: 4rem;
    height: 4rem;
    min-height: 4rem;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border-radius: .8rem;

    background: ${({ theme }) => theme.COLORS.BLUE};
    color: ${({ theme }) => theme.COLORS.WHITE_900};

    svg {
        width: 2.2rem;
        height: 2.2rem;
    }
`;

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: .4rem;

`;

export const Title = styled.h4`
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};
    font-size: 1.5rem;

    color: ${({ theme }) => theme.COLORS.WHITE_900};
`;

export const Line = styled.p`
    font-size: 1.4rem;
    line-height: 150%;

    color: ${({ theme }) => theme.COLORS.GRAY_400};

    white-space: pre-line;
`;