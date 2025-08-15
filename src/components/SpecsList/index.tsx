'use client';

import React from "react";
import { Container, Title, List, Row, Label, Value, ValueLink } from "./styles";

export type SpecItem = {
    label: string;
    value: React.ReactNode | string | number;
    href?: string
}

export interface SpecsListProps {
    title?: string;
    items: SpecItem[];
    className?: string;
}

export function SpecsList({ title = 'Especificações', items, className }: SpecsListProps) {
    return (
        <Container className={className} role="table" aria-label={title} >
            <Title>{title}</Title>

            <List>
                {items.map(({ label, value, href }, i) => (
                    <Row key={`${label}-${i}`} role="row">
                        <Label role="rowheader">{label}</Label>

                        <Value role="cell">
                            {href ? <ValueLink href={href}></ValueLink> : value}
                        </Value>
                    </Row>
                ))}
            </List>
        </Container>
    );
}