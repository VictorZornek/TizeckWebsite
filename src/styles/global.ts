import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :root {
        font-size: 62.5%;
        --font-inter: 'Inter', sans-serif;
    }

    html {
        scroll-behavior: smooth;
    }

    body {
        background: ${({ theme }) => theme.COLORS.WHITE_900};
        color: ${({ theme }) => theme.COLORS.WHITE_900};

        -webkit-font-smoothing: antialiased;
    }

    body, input, button, textarea {
        font-family: var(--font-inter);
        font-size: 1.6rem;
        outline: none;
    }

    h1 {
        font-size: clamp(2rem, 1.2rem + 2vw, 3.2rem);
    }

    p {
        font-size: clamp(1.4rem, 1rem + 0.5vw, 1.8rem);
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