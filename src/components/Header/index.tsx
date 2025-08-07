'use client'

import { useState } from "react";
import Link from "next/link";

import { FaHome, FaBoxOpen } from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';

import { Container, Nav, NavItem, NavLink, SubMenu, SubMenuItem, MenuButton, MobileMenu } from "./styles";

export function Header(){
    const [menuOpen, setMenuOpen] = useState(false)
    const [categoriesOpen, setCategoriesOpen] = useState(false)

    const links = [
        { href: '#home', label: 'Início', icon: <FaHome /> },
        { 
            label: 'Produtos', 
            icon: <FaBoxOpen />,
            categories: [
                { href: '#products-suportes', label: 'Suportes' },
                { href: '#products-acessorios', label: 'Acessórios' }
            ],
        },
        { href: '#about', label: 'Sobre Tizeck', icon: <MdBusiness /> },
    ]

    return(
        <Container>
            <Nav>
                {links.map(link => (
                    link.categories ? (
                        <NavItem
                            key={link.label}
                            onMouseEnter={() => setCategoriesOpen(true)}
                            onMouseLeave={() => setCategoriesOpen(false)}
                        >
                            <NavLink as="button">{link.label}</NavLink>

                            <SubMenu open={categoriesOpen}>
                                {link.categories.map(category => (
                                    <Link key={category.href} href={category.href} passHref>
                                        <SubMenuItem onClick={() => setCategoriesOpen(false)}>
                                            {category.label}
                                        </SubMenuItem>
                                    </Link>
                                ))}
                            </SubMenu>
                        </NavItem>
                    ) : (
                        <Link key={link.href} href={link.href} passHref>
                            <NavLink onClick={() => setMenuOpen(false)}>
                                {link.label}
                            </NavLink>
                        </Link>
                    )
                ))}
            </Nav>

            <MenuButton
                aria-label="Abrir menu"
                onClick={() => setMenuOpen((o) => !o)}
            >
                <svg viewBox="0 0 100 80">
                    <rect width="100" height="10" />
                    <rect y="30" width="100" height="10" />
                    <rect y="60" width="100" height="10" />
                </svg>
            </MenuButton>

            <MobileMenu open={menuOpen}>
                {links.map(link => (
                    link.categories ? (
                        <div key={link.label} className="wrapper-categories">
                            <NavLink
                                as="button"
                                onClick={() => setCategoriesOpen(open => !open)}
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                            {categoriesOpen && (
                                <div className="wrapper-categories-labels">
                                    {link.categories.map(category => (
                                            <Link key={category.href} href={category.href} passHref>
                                                <NavLink
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        setCategoriesOpen(false);
                                                    }}
                                                    style={{ paddingLeft: '2rem' }}
                                                >
                                                    {category.label}
                                                </NavLink>

                                            </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link key={link.href} href={link.href} passHref>
                            <NavLink onClick={() => setMenuOpen(false)}>
                                {link.icon}
                                {link.label}
                            </NavLink>
                        </Link>
                    )
                ))}
            </MobileMenu>
        </Container>
    )
}