import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 9rem auto 0;

    max-width: 37.5rem;

    overflow-x: hidden;

    > h1 {
        font-size: 2.2rem;
        color: ${({ theme }) => theme.COLORS.WHITE_600};

        text-align: center;

        margin-bottom: 3rem;
    }

    > main {
        .wrapper-products {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            align-items: center;

            margin-top: 3rem;

            .products-side-to-side {
                display: flex;
                gap: 3rem;
            }
        }


    }

    @media (min-width: 768px) {
        max-width: 200rem;

        > main {
            .wrapper-products {
                display: flex;
                gap: 10rem;
            }
        }
    }
`;