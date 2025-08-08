import styled from "styled-components";

export const Container = styled.div`
    width: 20rem;
    height: 18rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;

    padding: 1rem 1.5rem 2rem;

    border-radius: 1rem;

    background-color: rgba(255, 255, 255, 0.05);

    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-0.8rem);
        box-shadow: 0 1.6rem 3.2rem rgba(0, 0, 0, 0.25)
    }
`;

export const ImageWrapper = styled.img`
    width: 18rem;
    height: 10rem;

    object-fit: cover;

    margin-bottom: 1.6rem;
    padding: 1rem;

    border-radius: 1rem;

    background-color: rgba(14, 14, 14, 0.3);
`;

export const ProductName = styled.h5`
    font-size: 1.8rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};

    color: ${({ theme }) => theme.COLORS.WHITE_900};

    margin-top: auto;
`;