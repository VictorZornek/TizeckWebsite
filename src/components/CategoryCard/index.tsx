'use cliente'

import React from "react";
import { Container, ImageWrapper, CategoryName } from "./styles";

export interface CategoryCardProps {
    imageUrl: string;
    name: string;
}

export function CategoryCard({ imageUrl, name }: CategoryCardProps) {
    return (
        <Container>
            <ImageWrapper src={imageUrl} alt={name} />
            <CategoryName>{name}</CategoryName>
        </Container>
    )
}