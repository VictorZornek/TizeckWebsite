import styled from "styled-components";

export const Container = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    width: 30rem;
    height: 4rem;

    margin: 0 auto;
    padding: 1rem 2rem;

    font-family: 'Cinzel', serif;
    font-size: 1.8rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};
    text-align: start;

    border: none;
    border-radius: 1rem;

    color: ${({ theme }) => theme.COLORS.WHITE_900};
    background-color: ${({ theme }) => theme.COLORS.GRAY_500};

    &:hover {
        background-color: ${({ theme }) => theme.COLORS.GRAY_300};
        color:            ${({ theme }) => theme.COLORS.WHITE_900};
    }

    .text {
        flex: 1;
        text-align: left;
    }
`;