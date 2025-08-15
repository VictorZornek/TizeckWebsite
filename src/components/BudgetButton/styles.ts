'use client';

import styled, { css } from "styled-components";

export const Container = styled.a<{ $fullWidth?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: 4.4rem;

    padding: 0 4.2rem;

    border-radius: 1.2rem;
    border: none;

    text-decoration: none;

    font-family: var(--font-inter, system-ui, Arial, sans-serif);
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
    font-size: 1.4rem;
    letter-spacing: .06rem;
    text-transform: uppercase;
    
    color: ${({ theme }) => theme.COLORS.WHITE_900};
    background: linear-gradient(90deg, rgba(16, 26, 51, 1) 0%, rgba(59, 129, 245, 1) 100%);;

    box-shadow:
        0 6px 18px rgba(17, 24, 39, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;

    ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

    &:hover { 
        filter: brightness(1.05); transform: translateY(-1px); 
    }

    &:active { 
        transform: translateY(0); filter: brightness(0.98); 
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35),
                    0 6px 18px rgba(17, 24, 39, 0.18);
    }
`;