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

    if (href?.startsWith("#")) {
        const onHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            const el = document.querySelector(href);
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
            const path = typeof window !== "undefined" ? window.location.pathname : "/";
            window.history.replaceState(null, "", `${path}${href}`);
        };
        return (
            <Link href={href} scroll={false} onClick={onHashLinkClick}>
                {content}
            </Link>
        );
    }

    return href ? (
        <Link href={href}>
            {content}
        </Link>
    ) : content;
}