import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 9rem auto 0;

    max-width: 37.5rem;

    overflow-x: hidden;

    h1 {
        font-size: 2.2rem;
        color: ${({ theme }) => theme.COLORS.WHITE_600};

        text-align: center;

        margin-bottom: 3rem;
    }

    main {
        .wrapper-categories {
            display: flex;
            flex-direction: column;
            gap: 3rem;

            align-items: center;
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

