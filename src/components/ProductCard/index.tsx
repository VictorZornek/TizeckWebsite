'use client'

import React from "react";
import { Container, ImageWrapper, ProductName, Button } from "./styles";


export interface ProductCardProps {
    imageUrl: string;
    name: string;
}

export function ProductCard({ imageUrl, name }: ProductCardProps) {
    return (
        <Container>
            <ImageWrapper src={imageUrl} alt={name} />
            <ProductName>{name}</ProductName>
            
            <Button>Ver mais</Button>
        </Container>
    )
}