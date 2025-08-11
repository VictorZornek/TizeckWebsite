'use client'

import Link from "next/link";

import { ButtonHTMLAttributes } from "react";
import React from "react";

import { Container } from "./styles";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string;
    href?: string;
    isDark?: boolean; 
}

export function Button({ title, href, isDark = false, ...rest }: ButtonProps) {
    const content = (
        <Container type="button" $isdark={isDark} {...rest}>
            {title}
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