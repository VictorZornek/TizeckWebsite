'use client'

import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

import { ButtonHTMLAttributes } from "react";
import React from "react";

import { Cinzel } from 'next/font/google'; 
import { Container } from "./styles";

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    title?: string;
    href?: string;
}

export function ButtonLinktree({ icon, title, href, ...rest }: ButtonProps) {
    const content = (
        <Container className={cinzel.className} type="button" {...rest}>
            {icon}
            <span className="text">{title}</span>
            <FaArrowRight />
        </Container>
    );

    if (href?.startsWith("http")) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return href ? (
        <Link href={href}>
            {content}
        </Link>
    ) : content;
}