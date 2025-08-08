import styled from "styled-components";

export const Container = styled.div`
    width: 30rem;
    height: 8rem;

    display: flex;
    gap: 2rem;

    padding: 1rem 1.5rem 2rem;

    border-radius: .8rem;

    background-color: rgba(255, 255, 255, 0.07);

    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-0.8rem);
        box-shadow: 0 1.6rem 3.2rem rgba(255, 255, 255, 0.2);
    }
`;

export const ImageWrapper = styled.img`
    width: 7rem;
    height: 6rem;

    object-fit: cover;

    padding: .5rem;

    border-radius: .8rem;

    background-color: rgba(255, 255, 255, 0.3);
`;

export const CategoryName = styled.h5`
    font-size: 1.8rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    color: ${({ theme }) => theme.COLORS.WHITE_900};

    align-self: center;
    margin-top: 1rem;
`;