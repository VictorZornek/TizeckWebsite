'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { FaHome, FaBoxOpen } from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';

import { Container, Nav, NavItem, NavLink, SubMenu, SubMenuItem, MenuButton, Backdrop, Sidebar, DrawerHeader, CloseButton, DrawerNav, DrawerSectionTitle } from "./styles";

import logoTizeck from '@/assets/Group 12.svg';

type LinkWithHref = {
    href: string;
    label: string;
    icon: React.ReactNode;
};

type LinkWithCategories = {
    label: string;
    icon: React.ReactNode;
    categories: Array<{ href: string; label: string }>;
};

type NavLink = LinkWithHref | LinkWithCategories;

export function Header(){
    const [menuOpen, setMenuOpen] = useState(false)
    const [categoriesOpen, setCategoriesOpen] = useState(false)

    useEffect(() => {
        if (menuOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            
            return () => { 
                document.body.style.overflow = original; 
            }
        }
    }, [menuOpen]);

    // fecha no ESC e ao clicar fora
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                setCategoriesOpen(false);
            }
        }

        function onClickOutside(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest('nav') && categoriesOpen) {
                setCategoriesOpen(false);
            }
        }

        window.addEventListener('keydown', onKeyDown);
        document.addEventListener('click', onClickOutside);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('click', onClickOutside);
        }
    }, [categoriesOpen]);

    const links: NavLink[] = [
        { href: '#home', label: 'Início', icon: <FaHome /> },
        { 
            label: 'Produtos', 
            icon: <FaBoxOpen />,
            categories: [
                { href: '/products/Bomba', label: 'Bombas' },
                { href: '/products/Suporte%20MAX', label: 'Suporte MAX' },
                { href: '/products/Suporte%20Master', label: 'Suporte Master' },
                { href: '/products/Suporte%20Quadrado', label: 'Suporte Quadrado' },
                { href: '/products/Suporte%20Redondo', label: 'Suporte Redondo' },
                { href: '/products/Torneira', label: 'Torneiras' },
            ],
        },
        { href: '#about', label: 'Sobre Tizeck', icon: <MdBusiness /> },
    ]

    const closeAll = () => {
        setMenuOpen(false);
        setCategoriesOpen(false);
    };

    return (
        <Container>
            <Link href="/">
                <Image src={logoTizeck} alt="Logo Tizeck" width={140} height={40} priority style={{ cursor: 'pointer' }} />
            </Link>

            <Nav>
                {links.map(link => (
                    'categories' in link ? (
                        <NavItem key={link.label}>
                            <NavLink 
                                as="button" 
                                onClick={() => setCategoriesOpen(o => !o)}
                            >
                                {link.label}
                            </NavLink>

                            <SubMenu open={categoriesOpen}>
                                {link.categories.map(category => (
                                    <Link key={category.href} href={category.href}>
                                        <SubMenuItem onClick={() => setCategoriesOpen(false)}>
                                            {category.label}
                                        </SubMenuItem>
                                    </Link>
                                ))}
                            </SubMenu>
                        </NavItem>
                    ) : 'href' in link ? (
                        <NavItem key={link.href}>
                            <Link href={link.href}>
                                <NavLink onClick={() => setMenuOpen(false)}>
                                    {link.label}
                                </NavLink>
                            </Link>
                        </NavItem>
                    ) : null
                ))}
            </Nav>

            <MenuButton
                aria-label="Abrir menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
            >
                <svg viewBox="0 0 100 80">
                    <rect width="100" height="10" />
                    <rect y="30" width="100" height="10" />
                    <rect y="60" width="100" height="10" />
                </svg>
            </MenuButton>

            <Backdrop open={menuOpen} onClick={closeAll} />

            <Sidebar open={menuOpen} aria-hidden={!menuOpen} aria-label="Menu principal">
                <DrawerHeader>
                    <Link href="/" onClick={closeAll}>
                        <Image src={logoTizeck} alt="Logo Tizeck" width={120} height={34} style={{ cursor: 'pointer' }} />
                    </Link>
                
                    <CloseButton aria-label="Fechar menu" onClick={closeAll} >
                        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                            <path d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.17 7.1 4.3A1 1 0 1 0 5.7 5.7L10.6 10.6 5.7 15.5a1 1 0 1 0 1.4 1.4L12 12.03l4.9 4.87a1 1 0 0 0 1.4-1.4l-4.88-4.9 4.88-4.9Z"/>
                        </svg>
                    </CloseButton>
                </DrawerHeader>

                <DrawerNav>
                    {links.map(link => (
                        'categories' in link ? (
                            <div key={link.label}>
                                <NavLink 
                                    as="button" 
                                    className="drawer-item" 
                                    onClick={() => setCategoriesOpen(o => !o)}
                                >
                                    {link.icon}
                                    {link.label}
                                    <span className={`caret ${categoriesOpen ? 'open' : ''}`} aria-hidden>▾</span>
                                </NavLink>
                                
                                {categoriesOpen && (
                                    <>
                                        <DrawerSectionTitle>Categorias</DrawerSectionTitle>
                                    
                                        {link.categories.map(category => (
                                            <Link key={category.href} href={category.href}>
                                                <NavLink className="drawer-subitem" onClick={closeAll}>
                                                    {category.label}
                                                </NavLink>
                                            </Link>
                                        ))}
                                    </>
                                )}
                            </div>
                        ) : 'href' in link ? (
                            <Link key={link.href} href={link.href}>
                                <NavLink className="drawer-item" onClick={closeAll}>
                                    {link.icon}
                                    {link.label}
                                </NavLink>
                            </Link>
                        ) : null
                    ))}
                </DrawerNav>
            </Sidebar>
        </Container>
    )
}