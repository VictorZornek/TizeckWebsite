"use client";

import styled from "styled-components";

import { down, up } from "@/styles/media";

export const Button = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    min-width: 4.4rem;
    min-height: 4.4rem;

    padding: 0.4rem 0.6rem;

    border: none;
    border-radius: 0.8rem;

    font-family: var(--font-inter, system-ui, Arial, sans-serif);
    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.SEMI_BOLD};
    font-size: 1.4rem;
    line-height: 1;

    color: ${({ theme }) => theme.COLORS.WHITE_900};
    background: transparent;

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.15s ease, background 0.15s ease, opacity 0.15s ease;

    svg {
        flex-shrink: 0;
    }

    &:hover {
        opacity: 0.92;
        background: rgba(255, 255, 255, 0.12);
    }

    &:active {
        opacity: 1;
        background: rgba(255, 255, 255, 0.18);
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }

    ${up("md")} {
        min-width: unset;
        min-height: unset;

        gap: 0.6rem;
        padding: 0.65rem 1.2rem;

        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 999px;

        background: rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(8px);

        &:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
        }

        &:active {
            background: rgba(255, 255, 255, 0.16);
        }

        &:focus-visible {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
        }
    }
`;

export const Label = styled.span`
    ${down("md")} {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
