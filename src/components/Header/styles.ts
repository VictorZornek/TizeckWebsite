import styled from "styled-components";

export const Container = styled.header`
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    padding: 1rem 1.5rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: ${({ theme }) => theme.COLORS.GRAY_700};
    color: ${({ theme }) => theme.COLORS.WHITE_900};

    z-index: 1000;
`;

export const Nav = styled.nav`
    display: none;
    gap: 2rem;

    @media (min-width: 768px) {
        display: flex;
    }
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

    svg {
        color: ${({ theme }) => theme.COLORS.BLUE};
    }

    &:hover {
        color: ${({ theme }) => theme.COLORS.BLUE};
    }
  
`;

export const MenuButton = styled.button`
    all: unset;
    cursor: pointer;
    margin-left: auto;

    margin-top: .8rem;
    margin-right: .8rem;

    @media (min-width: 768px) {
        display: none;
    }

    svg {
        width: 2.8rem;
        height: 2.8rem;
        fill: ${({ theme }) => theme.COLORS.WHITE_900};
    }
`;

export const MobileMenu = styled.div<{ open: boolean }>`
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 1.5rem;
    width: max-content;
    min-width: 160px;
    
    display: ${({ open }) => (open ? 'flex' : 'none')};
    flex-direction: column;

    font-size: 1.8rem;

    border: 1px solid ${({ theme }) => theme.COLORS.GRAY_700};
    border-radius: 0.5rem;

    background-color: rgba(214, 214, 214, 0.5);

    overflow: hidden;
    z-index: 1;

    a {
        padding: 0.75rem 1rem;
    }

    a:last-child {
        border-bottom: none;
    }

    @media (min-width: 768px) {
        display: none;
    }
`;