import styled from "styled-components";

export const Container = styled.div`
    width: 15rem;
    height: 18rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    text-align: center;

    padding: 1rem 1.5rem 2rem;
    margin-bottom: 2rem;

    border-radius: 1rem;

    background-color: rgba(255, 255, 255, 0.05);

    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-0.8rem);
        box-shadow: 0 1.6rem 3.2rem rgba(255, 255, 255, 0.2);
    }
`;

export const ImageWrapper = styled.img`
    width: 13rem;
    height: 8rem;

    object-fit: cover;

    margin-bottom: 1.6rem;
    padding: 1rem;

    border-radius: 1rem;

    background-color: rgba(255, 255, 255, 0.05);

`;

export const ProductName = styled.h5`
    font-size: 1.5rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};

    color: ${({ theme }) => theme.COLORS.WHITE_900};

    margin-top: auto;
`;

export const Button = styled.button`
    width: 8rem;
    height: 2.5rem;

    font-size: 1.4rem;

    border-radius: .5rem;
    border: 1px solid ${({ theme }) => theme.COLORS.BLACK_900};

    background-color: ${({ theme }) => theme.COLORS.BLUE};

`;