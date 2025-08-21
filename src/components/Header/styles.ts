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

    ${up('lg')} {
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

    /* variações para o drawer */
    &.drawer-item {
        width: 100%;
        padding: 1.2rem 1.6rem;
        justify-content: flex-start;
        font-size: 1.6rem;
    }
    &.drawer-subitem {
        width: 100%;
        padding: 0.8rem 2.8rem;
        font-size: 1.5rem;
        color: ${({ theme }) => theme.COLORS.BLACK_900};
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

export const Backdrop = styled.div<{ open: boolean }>`
    position: fixed;
    inset: 0;

    background: rgba(0,0,0,.35);
    opacity: ${({ open }) => open ? 1 : 0};
    pointer-events: ${({ open }) => open ? 'auto' : 'none'};
    transition: opacity .25s ease;
    z-index: 1099;

    ${up('lg')} { 
        display: none; 
    }
`;

export const Sidebar = styled.aside<{ open: boolean }>`
    position: fixed;
    top: 0;
    right: 0;

    height: 100dvh;
    width: 80%;
    max-width: 34rem;

    background: ${({ theme }) => theme.COLORS.WHITE_900};
    border-left: 1px solid ${({ theme }) => theme.COLORS.WHITE_600};
    box-shadow: -8px 0 2.4rem rgba(0,0,0,.12);

    transform: translateX(${({ open }) => open ? '0' : '100%'});
    transition: transform .3s ease;

    display: flex;
    flex-direction: column;

    z-index: 1100;

    ${up('lg')} { 
        display: none; 
    }
`;

export const DrawerHeader = styled.div`
    height: var(--header-h);

    padding: 0 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid ${({ theme }) => theme.COLORS.WHITE_600};
`;

export const CloseButton = styled.button`
    all: unset;
    cursor: pointer;

    display: grid;
    place-items: center;

    width: 3.2rem;
    height: 3.2rem;

    svg path { 
        fill: ${({ theme }) => theme.COLORS.GRAY_700}; 
    }
`;

export const DrawerNav = styled.nav`
    display: flex;
    flex-direction: column;

    padding: .4rem 0 1.6rem;

    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .caret {
        margin-left: auto;
        transition: transform .2s ease;
    }
    .caret.open { 
        transform: rotate(180deg); 
    }
`;


export const DrawerSectionTitle = styled.p`
    font-family: var(--font-inter);
    font-size: 1.2rem;
    letter-spacing: .06rem;
    text-transform: uppercase;

    color: ${({ theme }) => theme.COLORS.BLACK_700};
    
    padding: .4rem 1.6rem;
    margin-top: .6rem;
`;
