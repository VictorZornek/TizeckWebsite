'use client'

import React from "react";
import Link from "next/link";

import { Container, ImageWrapper, ProductName, Button } from "./styles";


export interface ProductCardProps {
    imageUrl: string;
    name: string;
    href: string;
}

export function ProductCard({ imageUrl, name, href }: ProductCardProps) {
    return (
        <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <Container>
                <ImageWrapper src={imageUrl} alt={name} />
                <ProductName>{name}</ProductName>
                
                <Button>Ver mais</Button>
            </Container>
        </Link>
    )
}