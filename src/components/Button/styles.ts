import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.button<{ $isdark: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;

    width: 100%;
    max-width: 32rem;
    height: 4.4rem;
    min-height: 4.4rem;

    margin: 0 auto;
    padding: 1rem 1.5rem;

    font-size: 1.4rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};
    line-height: 1.2;
    text-align: center;

    border: ${({ theme, $isdark }) => $isdark ? `solid 1.5px ${theme.COLORS.WHITE_900}` : "none"};
    border-radius: .8rem;

    color: ${({ theme, $isdark }) => $isdark ? theme.COLORS.WHITE_900 : theme.COLORS.BLUE};
    background-color: ${({ theme, $isdark }) => $isdark ? "transparent" : theme.COLORS.WHITE_600};

    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ theme, $isdark }) => $isdark ? "rgba(255, 255, 255, 0.1)" : theme.COLORS.GRAY_300};
        transform: translateY(-2px);
    }

    ${up("md")} {
        max-width: 38rem;
        height: 4.8rem;
        min-height: 4.8rem;
        padding: 1.2rem 2rem;
        font-size: 1.6rem;
        gap: 1rem;
    }

    ${up("lg")} {
        padding: 1.2rem 2.4rem;
    }
`;