import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :root {
        font-size: 62.5%; /* 10px base */
        --font-inter: 'Inter', sans-serif;
    }

    @media (min-width: 768px) {
        :root {
            font-size: 68.75%; /* 11px base */
        }
    }

    html {
        scroll-behavior: smooth;
    }

    // compensa o header fixo
    [id] { 
        scroll-margin-top: 6rem; 
    }

    @media (min-width: 768px) {
        [id] { 
            scroll-margin-top: 7rem; 
        }
    }

    body {
        background: ${({ theme }) => theme.COLORS.WHITE_900};
        color: ${({ theme }) => theme.COLORS.WHITE_900};

        -webkit-font-smoothing: antialiased;
    }

    body, input, button, textarea {
        font-family: var(--font-inter);
        font-size: 1.4rem;
        outline: none;
    }

    @media (min-width: 768px) {
        body, input, button, textarea {
            font-size: 1.6rem;
        }
    }

    h1 {
        font-size: clamp(2.2rem, 1.5rem + 2vw, 3.2rem);
        line-height: 1.2;
    }

    h2 {
        font-size: clamp(2rem, 1.3rem + 1.5vw, 2.8rem);
        line-height: 1.3;
    }

    h3 {
        font-size: clamp(1.8rem, 1.2rem + 1vw, 2.2rem);
        line-height: 1.3;
    }

    p {
        font-size: clamp(1.3rem, 1rem + 0.5vw, 1.8rem);
        line-height: 1.5;
    }

    a {
        text-decoration: none;
        color: white;
    }

    button, a {
        cursor: pointer;
        transition: filter 0.2s;
    }

    button:hover, a:hover {
        filter: brightness(0.9);
    }
`;