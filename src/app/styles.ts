'use client'

import styled, { keyframes } from "styled-components";

const arrowBounce = keyframes`
    0%, 100% { transform: translateY(0);   opacity: .9; }
    50% { transform: translateY(8px); opacity: 1; }
`;

export const Container = styled.div`
    width: 39.5rem;
    height: 100vh;

    display: flex;
    flex-direction: column;

    margin: 2rem auto;

    > main {
        margin-top: 3rem;

        .hero {
            position: relative;
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
            }

            .arrow {
                position: absolute;
                left: 50%;
                bottom: 2.5rem;
                
                transform: translateX(-50%);

                width: 4.4rem;
                height: 4.4rem;

                display: grid;
                place-items: center;

                color: ${({ theme }) => theme.COLORS.WHITE_900};
                pointer-events: none; /* garante que não “vire botão” */
            }

            .arrow svg {
                width: 2.4rem;
                height: 2.4rem;
                stroke: currentColor;
                stroke-width: 2;
                fill: none;
                animation: ${arrowBounce} 1.2s ease-in-out infinite;
                will-change: transform;
            }
        }

        .about {
            height: 65rem;

            margin: 0 auto;
            text-align: center;

            background-color: ${({ theme }) => theme.COLORS.GRAY_300};

            .wrapper-title-text {
                padding: 3rem 3rem 0;
                margin-bottom: 3rem;

                display: flex;
                flex-direction: column;
                gap: 1rem;

                h2 {
                    font-size: 2rem;
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                    color: ${({ theme }) => theme.COLORS.DARK_BLUE};
                }

                p {
                    font-size: 1.2rem;
                    color: ${({ theme }) => theme.COLORS.GRAY_400};
                }
            }

            .wrapper-history {
                padding: 0 1.5rem;

                text-align: justify;

                display: flex;
                flex-direction: column;
                gap: 1rem;

                h3 {
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                    color: ${({ theme }) => theme.COLORS.DARK_BLUE};
                }

                p {
                    font-size: 1.1rem;
                    color: ${({ theme }) => theme.COLORS.GRAY_400};
                }
            }

            .wrapper-counters-image {
                margin-top: 2rem;

                img {
                    width: 30rem;
                    height: 15rem;

                    border-radius: .8rem;

                    margin-top: 1rem;
                }
            }
        }

        .categories {
            height: 80rem;

            margin: 0 auto;
            text-align: center;

            background: linear-gradient(135deg,rgba(16, 26, 51, 1) 0%, rgba(59, 129, 245, 1) 100%);

            padding: 1rem 1.5rem;

            .wrapper-title-text {
                padding: 3rem 3rem 0;
                margin-bottom: 3rem;

                display: flex;
                flex-direction: column;
                gap: 1rem;

                h2 {
                    font-size: 2.2rem;
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                    color: ${({ theme }) => theme.COLORS.WHITE_900};
                }

                p {
                    font-size: 1.4rem;
                    color: ${({ theme }) => theme.COLORS.WHITE_600};

                }
            }

            .wrapper-categories {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 7rem;
            }
        }
    }




`;

export const Counter = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5rem;

    margin-bottom: 2rem;

    span {
        font-size: 2rem;
        font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
        color: ${({ theme }) => theme.COLORS.BLUE};
    }

    p {
        font-size: 1.2rem;
        color: ${({ theme }) => theme.COLORS.GRAY_400};
    }


`;