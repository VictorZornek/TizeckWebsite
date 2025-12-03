import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.header`
    --header-h: 6rem;

    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: var(--header-h);
    padding: 0 1.5rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    border: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);

    z-index: 1000;

    > img {
        height: calc(var(--header-h) - 1.5rem);
        width: auto;
        max-width: 8rem;
        display: block;
    }

    ${up('md')} {
        --header-h: 7rem;
        padding: 0 3rem;

        > img {
            height: calc(var(--header-h) - 2rem);
            max-width: 10rem;
        }
    }
`;

export const Nav = styled.nav`
    display: none;
    gap: 0.5rem;

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
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};
    font-size: 1.5rem;
    text-decoration: none;

    display: flex;
    align-items: center;
    gap: 0.8rem;
    
    color: ${({ theme }) => theme.COLORS.BLACK_900};

    background: transparent;
    border: none;
    padding: 1rem 1.6rem;
    border-radius: 1.2rem;
    line-height: 1;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    svg {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.COLORS.BLUE};
        transition: transform 0.3s ease;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%) scaleX(0);
        width: 60%;
        height: 2px;
        background: linear-gradient(90deg, ${({ theme }) => theme.COLORS.BLUE} 0%, ${({ theme }) => theme.COLORS.DARK_BLUE} 100%);
        border-radius: 2px;
        transition: transform 0.3s ease;
    }

    &:hover {
        color: ${({ theme }) => theme.COLORS.BLUE};
        background: rgba(59, 129, 245, 0.08);
        transform: translateY(-1px);

        svg {
            transform: scale(1.1);
        }

        &::after {
            transform: translateX(-50%) scaleX(1);
        }
    }

    /* variações para o drawer */
    &.drawer-item {
        width: 100%;
        padding: 1.2rem 1.6rem;
        justify-content: flex-start;
        font-size: 1.6rem;
        border-radius: 0.8rem;
        margin: 0.2rem 0.8rem;
        width: calc(100% - 1.6rem);

        &:hover {
            background: rgba(30, 67, 177, 0.08);
        }
    }
    &.drawer-subitem {
        width: calc(100% - 1.6rem);
        padding: 1.2rem 1.6rem;
        margin: 0.4rem 0.8rem;
        font-size: 1.4rem;
        font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};
        color: ${({ theme }) => theme.COLORS.BLACK_900};
        background: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(30, 67, 177, 0.08);
        border-radius: 1rem;
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background: linear-gradient(180deg, ${({ theme }) => theme.COLORS.BLUE} 0%, ${({ theme }) => theme.COLORS.DARK_BLUE} 100%);
            transform: scaleY(0);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border-radius: 0 4px 4px 0;
        }

        &::after {
            content: '→';
            position: absolute;
            right: 1.4rem;
            font-size: 1.6rem;
            color: ${({ theme }) => theme.COLORS.BLUE};
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
        }

        &:hover {
            background: linear-gradient(135deg, rgba(30, 67, 177, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%);
            color: ${({ theme }) => theme.COLORS.BLUE};
            padding-left: 2rem;
            transform: translateX(4px) scale(1.01);
            border-color: rgba(30, 67, 177, 0.2);
            box-shadow: 0 6px 20px rgba(30, 67, 177, 0.12);

            &::before {
                transform: scaleY(1);
            }

            &::after {
                opacity: 1;
                transform: translateX(0);
            }
        }
    }
  
`;

export const SubMenu = styled.div<{ open: boolean }>`
    position: absolute;
    top: calc(100% + 1rem);
    left: 50%;
    transform: translateX(-50%);

    display: ${({ open }) => (open ? 'grid' : 'none')};
    grid-template-columns: 1fr;
    gap: 0.6rem;
    min-width: 28rem;

    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
    backdrop-filter: blur(15px);
    border: 2px solid rgba(30, 67, 177, 0.15);
    border-radius: 1.6rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    padding: 1.2rem;

    overflow: hidden;
    animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &::before {
        content: '';
        position: absolute;
        top: -1rem;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 1rem solid transparent;
        border-right: 1rem solid transparent;
        border-bottom: 1rem solid rgba(255, 255, 255, 0.98);
        filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
        }
    }

    z-index: 1000;
`;

export const SubMenuItem = styled.a`
    font-size: 1.5rem;
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};
    text-decoration: none;
    
    padding: 1.4rem 1.8rem;
    border-radius: 1.2rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;

    color: ${({ theme }) => theme.COLORS.BLACK_900};
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(30, 67, 177, 0.08);

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 5px;
        background: linear-gradient(180deg, ${({ theme }) => theme.COLORS.BLUE} 0%, ${({ theme }) => theme.COLORS.DARK_BLUE} 100%);
        transform: scaleY(0);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        border-radius: 0 4px 4px 0;
    }

    &::after {
        content: '→';
        position: absolute;
        right: 1.6rem;
        font-size: 1.8rem;
        color: ${({ theme }) => theme.COLORS.BLUE};
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.3s ease;
    }

    &:hover {
        background: linear-gradient(135deg, rgba(30, 67, 177, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%);
        color: ${({ theme }) => theme.COLORS.BLUE};
        padding-left: 2.4rem;
        transform: translateX(8px) scale(1.02);
        border-color: rgba(30, 67, 177, 0.2);
        box-shadow: 0 8px 24px rgba(30, 67, 177, 0.15);

        &::before {
            transform: scaleY(1);
        }

        &::after {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

export const MenuButton = styled.button`
    all: unset;
    cursor: pointer;
    margin-left: auto;

    display: grid;
    place-items: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    ${up("lg")} {
        display: none;
    }

    svg {
        width: 2.4rem;
        height: 2.4rem;
        fill: ${({ theme }) => theme.COLORS.GRAY_700};
    }

    ${up('md')} {
        width: 4rem;
        height: 4rem;

        svg {
            width: 2.8rem;
            height: 2.8rem;
        }
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
    width: 85%;
    max-width: 32rem;

    background: ${({ theme }) => theme.COLORS.WHITE_900};
    border-left: 1px solid ${({ theme }) => theme.COLORS.WHITE_600};
    box-shadow: -8px 0 2.4rem rgba(0,0,0,.12);

    transform: translateX(${({ open }) => open ? '0' : '100%'});
    transition: transform .3s ease;

    display: flex;
    flex-direction: column;

    z-index: 1100;

    ${up('sm')} {
        width: 80%;
        max-width: 34rem;
    }

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
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};

    color: ${({ theme }) => theme.COLORS.BLUE};
    
    padding: 1.2rem 1.6rem 0.6rem;
    margin-top: 0.4rem;
`;
