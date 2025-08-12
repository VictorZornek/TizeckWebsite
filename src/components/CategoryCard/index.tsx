'use client'

import React from "react";
import { Container, ImageWrapper, WrapperText, CategoryName, Description, Button } from "./styles";

export interface CategoryCardProps {
    name: string;
    description: string;
    imageUrl: string;
}

export function CategoryCard({ name, description, imageUrl }: CategoryCardProps) {
    return (
        <Container>
            <ImageWrapper src={imageUrl} alt={name} />

            <WrapperText>
                <CategoryName>{name}</CategoryName>
                <Description>{description}</Description>

                <Button>
                    Ver mais
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </Button>
            </WrapperText>
        </Container>
    )
}