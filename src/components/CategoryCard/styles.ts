import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.div`
    width: 100%;
    max-width: 30rem;
    height: 26.75rem;

    display: flex;
    flex-direction: column;
    gap: 2rem;

    padding-top: 1rem;

    border-radius: .8rem;

    background-color: rgba(255, 255, 255, 0.07);

    transition: transform 0.2s, box-shadow 0.2s;

    overflow: hidden;

    &:hover {
        transform: translateY(-0.8rem);
        box-shadow: 0 1.6rem 3.2rem rgba(0, 0, 0, 1);
    }

    ${up("lg")} {
        max-width: 32rem;
    }
`;

export const ImageWrapper = styled.img`
    width: 14rem;
    height: 9rem;

    object-fit: cover;

    padding: .5rem;

    border-radius: .8rem;

    align-self: center;
`;

export const WrapperText = styled.div`
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding: 1rem 2rem;

    border-radius: 0 0 .8rem .8rem;

    background-color: ${({ theme }) => theme.COLORS.WHITE_600};
`;

export const CategoryName = styled.h5`
    font-size: 1.8rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    color: ${({ theme }) => theme.COLORS.DARK_BLUE};

    align-self: flex-start;
`;

export const Description = styled.p`
    font-size: 1.4rem;
    color: ${({ theme }) => theme.COLORS.GRAY_400};
    text-align: justify;

    display: -webkit-box;
    -webkit-line-clamp: 3;    /* ajuste para 3–4 linhas */
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const Button = styled.button`
    background: none;
    border: none;

    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    margin-top: .5rem;
    align-self: flex-end;

    color: ${({ theme }) => theme.COLORS.BLUE};
    font-size: 1.4rem;
    font-weight: bolder;

    cursor: pointer;
    text-decoration: none;
`;