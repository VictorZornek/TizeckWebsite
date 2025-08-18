"use client"

import styled from "styled-components";
import { down, up } from "@/styles/media";

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0 auto;
    
    overflow-x: hidden;

    background: linear-gradient(135deg,rgba(16, 26, 51, 1) 0%, rgba(59, 129, 245, 1) 100%);


    > main {
        width: 100%;
        padding: 0 3rem;
        margin: 0 auto;

        > h1 {
            font-size: 2.2rem;
            color: ${({ theme }) => theme.COLORS.WHITE_600};

            text-align: center;

            margin: 8rem 0 3rem;
        }

        .wrapper-products {
            width: 100%;

            display: grid;
            grid-template-columns: 1fr;
            gap: .5rem;

            margin: 0 auto;

            .product-row {
                width: 100%;
                display: flex;
                justify-content: center;
            }

            ${up("md")} {
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
            }

            ${up("lg")} {
                grid-template-columns: repeat(3, 1fr);
            }
        }


    }

    ${up("md")} {
        max-width: 200rem;
    }
`;