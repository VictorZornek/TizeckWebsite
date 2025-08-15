'use client';

import React from "react";
import { Container } from "./styles";

export type BudgetButtonProps = {
    href?: string;
    label?: string;
    fullWidth?: boolean;
    ariaLabel?: string;
}

export function BudgetButton({ href, label = "SOLICITAR ORÇAMENTO", fullWidth = false, ariaLabel }: BudgetButtonProps) {
    return (
        <Container
            href={href}
            $fullWidth={fullWidth}
            aria-label={ariaLabel ?? label}
            target="_blank"
            rel="noopener noreferrer"
        >
            {label}
        </Container>
    )
}