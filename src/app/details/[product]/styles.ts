'use client';

import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0 auto;
    
    overflow-x: hidden;

    background-color: ${({ theme }) => theme.COLORS.WHITE_600};

    > main {
        width: 100%;
        padding: 0 1.6rem;
        margin: 0 auto 10rem;

        > h1 {
            font-size: 2.2rem;
            color: ${({ theme }) => theme.COLORS.BLACK_900};

            text-align: center;

            margin: 8rem 0 2rem;
        }

        > p {
            font-size: 1.6rem;
            color: ${({ theme }) => theme.COLORS.BLACK_900};

            text-align: center;

            margin-bottom: 3rem;
        }

        .wrapper-images-specs {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;

            margin-top: 4rem;

            ${up("lg")} {
                grid-template-columns: 1fr 1fr;
                align-items: start;
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