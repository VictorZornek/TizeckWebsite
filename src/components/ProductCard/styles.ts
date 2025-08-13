import styled from "styled-components";

export const Container = styled.div`
    width: 90%;
    height: 9rem;

    display: flex;
    align-items: center;
    gap: .5rem;

    padding: 1rem;
    margin-bottom: 2rem;

    border-radius: .8rem;

    background-color: ${({ theme }) => theme.COLORS.WHITE_600};

    transition: transform 0.2s, box-shadow 0.2s;

    .wrapper-buttons {
        display: flex;
        flex-direction: column;
        gap: .6rem;
    }

    &:hover {
        transform: translateY(-0.8rem);
        box-shadow: 0 1.6rem 3.2rem rgba(255, 255, 255, 0.2);
    }
`;

export const ImageWrapper = styled.img`
    width: 13rem;
    height: 8rem;

    object-fit: cover;

    padding: 1rem 1rem 1rem 0;

    border-radius: 1rem;
`;

export const ProductName = styled.h5`
    font-size: 1.5rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};

    color: ${({ theme }) => theme.COLORS.BLACK_900};
`;

export const Button = styled.button<{ $isgreen: boolean }>`
    width: 8rem;
    height: 2.5rem;

    font-size: 1.4rem;

    border-radius: .5rem;
    border: none;

    color: ${({ theme }) => theme.COLORS.WHITE_900};
    background-color: ${({ theme, $isgreen }) => $isgreen ? theme.COLORS.GREEN : theme.COLORS.BLUE};
`;