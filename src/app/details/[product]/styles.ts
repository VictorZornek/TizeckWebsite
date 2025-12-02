'use client';

import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.div`
    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0 auto;
    
    overflow: hidden;

    background: linear-gradient(135deg, #1E43B1 0%, #2563eb 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;

    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    > main {
        width: 100%;
        flex: 1;
        padding: 0 1.6rem;
        margin-bottom: 8rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1.5rem;

        > h1 {
            font-size: 2.2rem;
            color: ${({ theme }) => theme.COLORS.WHITE_900};
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

            text-align: center;

            margin: 0;
        }

        > p {
            font-size: 1.4rem;
            color: ${({ theme }) => theme.COLORS.WHITE_900};
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

            text-align: center;

            margin: 0;
        }

        .wrapper-images-specs {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;

            ${up("lg")} {
                grid-template-columns: 1fr 1fr;
                align-items: center;
            }
        }

    }

    > footer {
        position: fixed;
        bottom: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;

        padding: 1.5rem 0rem;

        z-index: 1000;

        background: ${({ theme }) => theme.COLORS.WHITE_900};
    }
`;