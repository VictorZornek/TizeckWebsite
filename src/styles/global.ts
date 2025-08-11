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
        font-size: 16px;
        outline: none;
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