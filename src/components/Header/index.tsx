'use client'

import { useState } from "react";
import Link from "next/link";

import { FaHome, FaBoxOpen } from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';

import { Container, Nav, NavLink, MenuButton, MobileMenu } from "./styles";
import { Cinzel } from 'next/font/google'; 

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export function Header(){
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { href: '#home', label: 'Início', icon: <FaHome /> },
        { href: '#products', label: 'Produtos', icon: <FaBoxOpen /> },
        { href: '#about', label: 'Sobre Tizeck', icon: <MdBusiness /> },
    ]

    return(
        <Container>
            <Nav>
                {links.map(({ href, label }) => (
                    <Link key={href} href={href} passHref>
                        <NavLink onClick={() => setMenuOpen(false)}>{label}</NavLink>
                    </Link>
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
                {links.map(({ href, label, icon }) => (
                    <Link key={href} href={href} passHref>
                        <NavLink className={cinzel.className} onClick={() => setMenuOpen(false)}>
                            {icon}
                            {label}
                        </NavLink>
                    </Link>
                ))}
            </MobileMenu>
        </Container>
    )
}