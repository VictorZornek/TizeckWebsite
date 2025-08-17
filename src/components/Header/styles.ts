import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.header`
    --header-h: 5.6rem;

    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: var(--header-h);
    padding: 0 1.5rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: ${({ theme }) => theme.COLORS.WHITE_900};
    color: ${({ theme }) => theme.COLORS.WHITE_900};

    z-index: 1000;

    > img {
        height: calc(var(--header-h) - 1.2rem);
        width: 10rem;
        display: block;
    }
`;

export const Nav = styled.nav`
    display: none;
    gap: 2rem;

    ${up("lg")} {
        display: flex;
    }
`;

export const NavItem = styled.div`
    position: relative;
    display: inline-block;
`;

export const NavLink = styled.a`
    font-family: var(--font-inter);
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.MEDIUM};
    font-size: 1.5rem;
    text-decoration: none;

    display: flex;
    align-items: center;
    gap: 1rem;
    
    color: ${({ theme }) => theme.COLORS.BLACK_900};

    background: transparent;
    border: none;
    padding: 0;        /* zera qualquer padding extra */
    line-height: 1;    /* manter altura de linha enxuta */

    svg {
        color: ${({ theme }) => theme.COLORS.BLUE};
    }

    &:hover {
        color: ${({ theme }) => theme.COLORS.BLUE};
    }
  
`;

export const SubMenu = styled.div<{ open: boolean }>`
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;

    display: ${({ open }) => (open ? 'flex' : 'none')};
    flex-direction: column;

    background-color: ${({ theme }) => theme.COLORS.WHITE_900};

    border: 1px solid ${({ theme }) => theme.COLORS.BLACK_900};
    border-radius: 0.5rem;

    overflow: hidden;

    z-index: 1000;
`;

export const SubMenuItem = styled.a`
    font-size: 1.4rem;
    text-decoration: none;
    
    padding: 0.75rem 1rem;

    color: ${({ theme }) => theme.COLORS.BLACK_900};

    &:hover {
        background-color: ${({ theme }) => theme.COLORS.GRAY_300};
        color: ${({ theme }) => theme.COLORS.BLUE};
    }
`;

export const MenuButton = styled.button`
    all: unset;
    cursor: pointer;
    margin-left: auto;

    display: grid;
    place-items: center;
    width: 4rem;
    height: 4rem;

    ${up("lg")} {
        display: none;
    }

    svg {
        width: 2.8rem;
        height: 2.8rem;
        fill: ${({ theme }) => theme.COLORS.GRAY_700};
    }
`;

export const MobileMenu = styled.div<{ open: boolean }>`
    position: absolute;
    top: calc(100% + 0.25rem);
    right: 1.5rem;
    width: max-content;
    min-width: 160px;
    
    display: ${({ open }) => (open ? 'flex' : 'none')};
    flex-direction: column;

    font-size: 1.4rem;

    border: 1px solid ${({ theme }) => theme.COLORS.WHITE_600};
    border-radius: 0.5rem;

    background-color: rgba(214, 214, 214, 0.8);

    overflow: hidden;
    z-index: 1;

    a {
        padding: 0.75rem 1rem;
    }

    .wrapper-categories {
        padding: 0.75rem 2rem;
    }

    .wrapper-categories-labels {
        display: flex;
        flex-direction: column;

        padding-left: 1.5rem;
        padding: 0 2rem 0 0.75rem;

        margin-top: 1rem;
    }

    .wrapper-categories-labels a {
        padding: .3rem 1rem;  /* afina ainda mais */
    }

    ${up("lg")} {
        display: none;
    }
`;