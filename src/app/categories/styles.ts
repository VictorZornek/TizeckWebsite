import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 10rem auto 0;

    max-width: 37.5rem;

    overflow-x: hidden;

    > main {
        .wrapper-categories {
            display: flex;
            flex-direction: column;
            gap: 3rem;

        }
    }

    @media (min-width: 768px) {
        max-width: 200rem;

        > main {
            .wrapper-categories {
                display: flex;
                gap: 10rem;
            }
        }
    }
`;

