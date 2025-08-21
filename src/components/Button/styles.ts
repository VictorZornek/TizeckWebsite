import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.button<{ $isdark: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    width: 100%;
    max-width: 38rem;
    height: 3.8rem;

    margin: 0 auto;
    padding: 1rem 1.6rem;

    font-size: 1.6rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};

    border: ${({ theme, $isdark }) => $isdark ? `solid 1.5px ${theme.COLORS.WHITE_900}` : "none"};
    border-radius: .6rem;

    color: ${({ theme, $isdark }) => $isdark ? theme.COLORS.WHITE_900 : theme.COLORS.BLUE};
    background-color: ${({ theme, $isdark }) => $isdark ? "transparent" : theme.COLORS.WHITE_600};

    &:hover {
        background-color: ${({ theme, $isdark }) => $isdark ? "transparent" : theme.COLORS.GRAY_300};
    }

    ${up("lg")} {
        height: 4.4rem;
        padding: 1.2rem 2.4rem;
    }
`;