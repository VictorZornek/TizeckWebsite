'use client'

import React from "react";

import { Container, CardLink, ImageWrapper, ProductName, ButtonText } from "./styles";


export interface ProductCardProps {
    imageUrl: string;
    name: string;
    href: string;
}

export function ProductCard({ imageUrl, name, href }: ProductCardProps) {
    return (
        <CardLink href={href} >
            <Container >
                <ImageWrapper src={imageUrl} alt={name} />
                <ProductName>{name}</ProductName>
                
                <ButtonText>Ver mais</ButtonText>
            </Container>
        </CardLink>
    )
}