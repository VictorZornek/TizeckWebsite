'use client'

import styled from "styled-components";

export const Container = styled.div`
    width: 37rem;
    height: 100vh;

    display: flex;
    flex-direction: column;

    margin: 0 auto;

    h1 {
        font-family: 'Cinzel', serif;
        font-size: 4.8rem;
        text-align: center;

        margin-bottom: 2rem;
    }

    .wrapper-buttons {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
`