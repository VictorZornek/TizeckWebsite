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

    body {
        background: radial-gradient(circle,rgba(0, 170, 255, 1) 0%, rgba(6, 78, 171, 1) 60%, rgba(9, 9, 121, 1) 100%);
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