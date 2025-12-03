'use client'

import styled, { keyframes } from "styled-components";
import { up } from "@/styles/media";

const arrowBounce = keyframes`
    0%, 100% { transform: translateY(0);   opacity: .9; }
    50% { transform: translateY(8px); opacity: 1; }
`;

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;

    display: flex;
    flex-direction: column;

    margin: 0;

    > main {
        margin-top: 6rem;

        ${up('md')} {
            margin-top: 7rem;
        }

        .hero {
            position: relative;
            min-height: 100vh;
            height: auto;

            margin: 0 auto;
            text-align: center;

            background: linear-gradient(135deg,rgba(16, 26, 51, 1) 0%, rgba(59, 129, 245, 1) 100%);

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem 1rem;

            .wrapper-text {
                padding: 2rem 1rem 0;
                margin-bottom: 3rem;

                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                max-width: 90rem;
                width: 100%;

                img {
                    max-width: 280px !important;
                    width: 100% !important;
                    height: auto !important;
                }

                h1 {
                    font-size: 2.2rem;
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                    line-height: 1.2;
                }

                p {
                    font-size: 1.4rem;
                    line-height: 1.5;
                    padding: 0 1rem;
                }

                ${up('md')} {
                    padding: 4rem 2rem 0;
                    margin-bottom: 4rem;
                    gap: 2rem;

                    img {
                        max-width: 400px !important;
                    }

                    h1 {
                        font-size: 3rem;
                    }

                    p {
                        font-size: 1.8rem;
                        padding: 0;
                    }
                }
            }

            .wrapper-buttons {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                width: 100%;
                max-width: 50rem;

                padding: 0 1rem;
                margin-bottom: 2rem;

                ${up("md")} {
                    flex-direction: row;
                    justify-content: center;
                    gap: 2rem;
                    padding: 0 2rem;
                }
            }

            .arrow {
                position: absolute;
                left: 50%;
                bottom: 1rem;
                
                transform: translateX(-50%);

                width: 4.4rem;
                height: 4.4rem;

                display: flex;
                justify-content: center;
                align-items: center;

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
            margin: 0 auto;
            text-align: center;
            padding: 6rem 0;

            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -10%;
                width: 40rem;
                height: 40rem;
                background: radial-gradient(circle, rgba(30, 67, 177, 0.1) 0%, transparent 70%);
                border-radius: 50%;
            }

            &::after {
                content: '';
                position: absolute;
                bottom: -30%;
                left: -5%;
                width: 30rem;
                height: 30rem;
                background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
                border-radius: 50%;
            }

            .wrapper-title-text {
                padding: 0 1.5rem;
                margin-bottom: 3rem;
                position: relative;
                z-index: 1;

                display: flex;
                flex-direction: column;
                gap: 1.5rem;

                h2 {
                    font-size: 2.5rem;
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                    color: ${({ theme }) => theme.COLORS.DARK_BLUE};
                    position: relative;
                    padding-bottom: 2rem;
                    line-height: 1.2;

                    &::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 6rem;
                        height: 0.4rem;
                        background: linear-gradient(90deg, ${({ theme }) => theme.COLORS.BLUE} 0%, ${({ theme }) => theme.COLORS.DARK_BLUE} 100%);
                        border-radius: 2px;
                    }

                    ${up('md')} {
                        font-size: 3.5rem;

                        &::after {
                            width: 8rem;
                        }
                    }
                }

                p {
                    font-size: 1.5rem;
                    color: ${({ theme }) => theme.COLORS.GRAY_400};
                    max-width: 70rem;
                    margin: 0 auto;
                    line-height: 1.6;

                    ${up('md')} {
                        font-size: 1.8rem;
                    }
                }

                ${up('md')} {
                    padding: 0 3rem;
                    margin-bottom: 4rem;
                }
            }

            .wrapper-history {
                padding: 2rem 1.5rem;
                max-width: 90rem;
                margin: 0 1rem;
                position: relative;
                z-index: 1;

                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                border-radius: 1.5rem;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

                display: flex;
                flex-direction: column;
                gap: 1.5rem;

                h3 {
                    font-size: 1.8rem;
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                    color: ${({ theme }) => theme.COLORS.BLUE};
                    text-align: center;
                    margin-bottom: 1rem;
                    line-height: 1.3;

                    ${up('md')} {
                        font-size: 2.2rem;
                    }
                }

                p {
                    font-size: 1.3rem;
                    color: ${({ theme }) => theme.COLORS.GRAY_400};
                    line-height: 1.8;
                    text-align: left;

                    ${up('md')} {
                        font-size: 1.4rem;
                        text-align: justify;
                    }
                }

                ${up('md')} {
                    padding: 3rem 2.5rem;
                    margin: 0 auto;
                }
            }

            .wrapper-counters {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2rem;
                margin-top: 3rem;
                position: relative;
                z-index: 1;
                padding: 0 1rem;

                ${up('sm')} {
                    flex-direction: row;
                    gap: 3rem;
                }

                ${up('md')} {
                    gap: 10rem;
                    margin-top: 5rem;
                    padding: 0 2rem;
                }
            }

            .wrapper-image {
                display: flex;
                justify-content: center;
                margin-top: 5rem;
                position: relative;
                z-index: 1;
                
                img {
                    width: 100%;
                    max-width: 60rem;
                    height: auto;
                    border-radius: 2rem;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                    border: 5px solid white;
                    transition: transform 0.3s ease;

                    &:hover {
                        transform: scale(1.02);
                    }
                }
            }
        }

        .categories {
            margin: 0 auto;
            text-align: center;

            background: linear-gradient(135deg,rgba(16, 26, 51, 1) 0%, rgba(59, 129, 245, 1) 100%);

            padding: 1rem 1.5rem 8rem;

            .wrapper-title-text {
                padding: 2rem 1.5rem 0;
                margin-bottom: 2rem;

                display: flex;
                flex-direction: column;
                gap: 1rem;

                h2 {
                    font-size: 2rem;
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                    color: ${({ theme }) => theme.COLORS.WHITE_900};
                    line-height: 1.3;

                    ${up('md')} {
                        font-size: 2.2rem;
                    }
                }

                p {
                    font-size: 1.4rem;
                    color: ${({ theme }) => theme.COLORS.WHITE_600};
                    line-height: 1.5;

                    ${up('md')} {
                        font-size: 1.6rem;
                    }
                }

                ${up('md')} {
                    padding: 3rem 3rem 0;
                    margin-bottom: 3rem;
                }
            }

            .wrapper-categories {
                display: grid;
                grid-template-columns: 1fr;
                gap: 3.5rem;

                justify-items: center;

                ${up("md")} { 
                    grid-template-columns: repeat(2, 1fr); 

                    .wrapper-categories > *:nth-last-child(1):nth-child(2n + 1) {
                        grid-column: 1 / span 2;
                    }
                }

                ${up("lg")} { 
                    grid-template-columns: repeat(3, 1fr); 
                
                    .wrapper-categories > *:nth-last-child(1):nth-child(3n + 1) {
                        grid-column: 2;
                    }
                }

                ${up("xl")} { 
                    grid-template-columns: repeat(4, 1fr); 
                
                    .wrapper-categories > *:nth-last-child(1):nth-child(4n + 1) {
                        grid-column: 2 / span 2;
                    }

                    .wrapper-categories > *:nth-last-child(2):nth-child(4n + 1) {
                        grid-column: 2;
                    }
                }
            }
        }

        .contact {
            width: 100%;

            background-color: ${({ theme }) => theme.COLORS.DARK_BLUE};

            padding: 4rem 2rem;

            .wrapper-text {
                display: flex;
                flex-direction: column;
                gap: 1rem;

                text-align: center;

                margin-bottom: 3rem;

                h1 {
                    font-size: 2.2rem;
                    font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
                    line-height: 1.3;

                    ${up('md')} {
                        font-size: 3rem;
                    }
                }

                p {
                    font-size: 1.4rem;
                    color: ${({ theme }) => theme.COLORS.GRAY_300};
                    line-height: 1.5;
                    padding: 0 1rem;

                    ${up('md')} {
                        font-size: 1.6rem;
                        padding: 0;
                    }
                }

                ${up('md')} {
                    margin-bottom: 5rem;
                }
            }

            .contact-info {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem;
                max-width: 120rem;
                margin: 0 auto 2rem;
                
                h3 {
                    font-size: 1.8rem;
                    margin-bottom: 1.5rem;
                    grid-column: 1 / -1;
                    line-height: 1.3;

                    ${up('md')} {
                        font-size: 2rem;
                        margin-bottom: 2rem;
                        text-align: center;
                    }
                }

                ${up('md')} {
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2.5rem;
                    margin: 0 auto 3rem;
                }
            }

            .worktime {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                max-width: 50rem;
                margin: 0 auto;

                h3 {
                    font-size: 1.8rem;
                    text-align: center;
                    line-height: 1.3;

                    ${up('md')} {
                        font-size: 2rem;
                    }
                }

                ${up('md')} {
                    gap: 2rem;
                }
            }
        }
    }

    
`;

export const Counter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    max-width: 20rem;

    background: rgba(255, 255, 255, 0.9);
    padding: 2rem 1.5rem;
    border-radius: 1.5rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(30, 67, 177, 0.2);
    }

    span {
        font-size: 3rem;
        font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
        background: linear-gradient(135deg, ${({ theme }) => theme.COLORS.BLUE} 0%, ${({ theme }) => theme.COLORS.DARK_BLUE} 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;

        ${up('md')} {
            font-size: 4rem;
        }
    }

    p {
        font-size: 1.2rem;
        color: ${({ theme }) => theme.COLORS.GRAY_400};
        font-weight: ${({ theme }) => theme.FONTS_WEIGHT.MEDIUM};
        text-align: center;
        line-height: 1.3;

        ${up('md')} {
            font-size: 1.4rem;
        }
    }

    ${up('md')} {
        gap: 1rem;
        padding: 3rem 4rem;
        max-width: none;
        width: auto;
    }
`;

export const WorktimeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    width: 100%;

    padding: 1.5rem;

    border-radius: 1rem;

    background-color: rgba(255, 255, 255, 0.07);

    .wrapper-day-hour {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .day {
            color: ${({ theme }) => theme.COLORS.GRAY_300};
            font-size: 1.3rem;
            line-height: 1.3;
        }

        .hour {
            font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
            font-size: 1.3rem;
            line-height: 1.3;
        }
    }

    @media (min-width: 768px) {
        gap: 1rem;
        padding: 2rem;

        .wrapper-day-hour {
            .day {
                font-size: 1.4rem;
            }

            .hour {
                font-size: 1.4rem;
            }
        }
    }
`;