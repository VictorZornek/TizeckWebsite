import styled from "styled-components";
import Link from "next/link";

export const CardLink = styled(Link)`
    display: block;
    width: 100%;

    text-decoration: none;
    color: inherit;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;

    width: 100%;
    padding: 2rem;
    margin-bottom: 2rem;

    border-radius: 1.2rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-0.4rem);
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.3);
    }
`;

export const ImageWrapper = styled.img`
    width: 100%;
    max-width: 20rem;
    height: 16rem;

    object-fit: contain;

    border-radius: .8rem;
`;

export const ProductName = styled.h5`
    margin: 0;
    padding: 0;

    font-size: 1.8rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    line-height: 1.3;

    text-align: center;

    color: ${({ theme }) => theme.COLORS.WHITE_900};
`;

export const ButtonText = styled.span`
    padding: 1rem 2.4rem;
    margin-top: .4rem;

    font-size: 1.4rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    text-decoration: none;

    border-radius: .6rem;
    background: ${({ theme }) => theme.COLORS.BLUE};
    color: ${({ theme }) => theme.COLORS.WHITE_900};

    transition: all 0.2s ease;

    cursor: pointer;

    &:hover {
        background: ${({ theme }) => theme.COLORS.DARK_BLUE};
        transform: scale(1.05);
    }
`;