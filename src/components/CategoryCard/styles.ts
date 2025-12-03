import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.div`
    width: 100%;
    max-width: 28rem;
    height: auto;
    min-height: 28rem;

    display: flex;
    flex-direction: column;
    gap: 0;

    padding-top: 1.5rem;

    border-radius: .8rem;

    background-color: rgba(255, 255, 255, 0.07);

    transition: transform 0.2s, box-shadow 0.2s;

    overflow: hidden;

    &:hover {
        transform: translateY(-0.8rem);
        box-shadow: 0 1.6rem 3.2rem rgba(0, 0, 0, 1);
    }

    ${up("md")} {
        max-width: 30rem;
        min-height: 32rem;
        padding-top: 2rem;
    }

    ${up("lg")} {
        max-width: 32rem;
    }
`;

export const ImageWrapper = styled.img`
    width: 16rem;
    height: 12rem;

    object-fit: contain;

    padding: .5rem;

    border-radius: .8rem;

    align-self: center;
    margin-bottom: 1rem;

    ${up("md")} {
        width: 18rem;
        height: 14rem;
    }
`;

export const WrapperText = styled.div`
    width: 100%;
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    padding: 1.2rem 1.5rem 1.5rem;

    border-radius: 0 0 .8rem .8rem;

    background-color: ${({ theme }) => theme.COLORS.WHITE_600};

    ${up("md")} {
        gap: 1rem;
        padding: 1.5rem 2rem 2rem;
    }
`;

export const CategoryName = styled.h5`
    font-size: 1.6rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    color: ${({ theme }) => theme.COLORS.DARK_BLUE};
    line-height: 1.3;
    margin: 0;

    align-self: flex-start;

    ${up("md")} {
        font-size: 1.8rem;
    }
`;

export const Description = styled.p`
    font-size: 1.3rem;
    color: ${({ theme }) => theme.COLORS.GRAY_400};
    text-align: left;
    line-height: 1.5;
    margin: 0;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    ${up("md")} {
        font-size: 1.4rem;
        text-align: justify;
    }
`;

export const Button = styled.button`
    background: none;
    border: none;

    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    margin-top: .3rem;
    align-self: flex-end;

    color: ${({ theme }) => theme.COLORS.BLUE};
    font-size: 1.3rem;
    font-weight: bolder;

    cursor: pointer;
    text-decoration: none;

    ${up("md")} {
        margin-top: .5rem;
        font-size: 1.4rem;
    }
`;