"use client"

import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0 auto;

    overflow-x: hidden;

    background: linear-gradient(135deg,rgba(16, 26, 51, 1) 0%, rgba(59, 129, 245, 1) 100%);


    > h1 {
        font-size: 2.2rem;
        color: ${({ theme }) => theme.COLORS.WHITE_600};

        text-align: center;

        margin-bottom: 3rem;
    }

    > main {
        .wrapper-products {
            display: flex;
            flex-direction: column;
            gap: 1.6rem;

            align-items: center;

            margin-top: 3rem;

            .product-row {
                width: 100%;
            }
        }


    }

    @media (min-width: 768px) {
        max-width: 200rem;

        > main {
            .wrapper-products {
                display: flex;
                gap: 10rem;
            }
        }
    }
`;