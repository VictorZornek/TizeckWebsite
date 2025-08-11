'use client'

import styled from "styled-components";

export const Container = styled.div`
    width: 39.5rem;
    height: 100vh;

    display: flex;
    flex-direction: column;

    margin: 2rem auto;

    > main {
        margin-top: 3rem;

        .hero {
            height: 40rem;

            margin: 0 auto;
            text-align: center;

            background: linear-gradient(135deg,rgba(16, 26, 51, 1) 0%, rgba(59, 129, 245, 1) 100%);

            .wrapper-text {
                padding: 5rem 3rem 0;
                margin-bottom: 3rem;

                display: flex;
                flex-direction: column;
                gap: 2rem;

                h1 {
                    font-size: 3rem;
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                }

                p {
                    font-size: 1.2rem;
                }
            }

            .wrapper-buttons {
                display: flex;
                flex-direction: column;
                gap: 1rem;

                margin-bottom: 6rem;
            }
        }
    }




`