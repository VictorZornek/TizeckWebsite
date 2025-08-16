import styled from "styled-components";
import Link from "next/link";

export const CardLink = styled(Link)`
    display: block;
    width: 100%;

    text-decoration: none;
    color: inherit;
`;

export const Container = styled.div`
    position: relative;

    width: 100%;
    height: 8rem;

    display: flex;
    align-items: center;
    gap: .5rem;

    padding: .8rem;
    padding-left: 0;
    margin-bottom: 2rem;

    border-radius: .8rem;

    background-color: ${({ theme }) => theme.COLORS.WHITE_600};

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

    padding: 1rem .5rem 1rem 0;

    border-radius: 1rem;
`;

export const ProductName = styled.h5`
    position: absolute;
    top: .8rem;
    left: 65%;
    transform: translateX(-50%);
    width: calc(100% - 1.6rem);
    text-align: center;
    margin: 0;

    font-size: 1.5rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};

    text-align: center;

    color: ${({ theme }) => theme.COLORS.BLACK_900};
`;

export const ButtonText = styled.span`
    position: absolute;
    right: .8rem;
    bottom: .8rem;

    font-size: 1.4rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    text-decoration: none;

    border-radius: .5rem;
    border: none;

    color: ${({ theme }) => theme.COLORS.BLUE};

    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;