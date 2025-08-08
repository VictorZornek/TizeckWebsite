import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 10rem auto 0;

    max-width: 37.5rem;

    overflow-x: hidden;

    h1 {
        font-size: 2.2rem;
        color: ${({ theme }) => theme.COLORS.WHITE_900};

        text-align: center;

        margin-bottom: 3rem;
    }

    > main {
        .wrapper-products {
            display: flex;
            flex-direction: column;
            gap: 3rem;

        }
    }
`;