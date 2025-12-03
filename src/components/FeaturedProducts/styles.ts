import styled from 'styled-components';
import { up } from '@/styles/media';

export const Container = styled.section`
    padding: 3rem 1.5rem;
    background: linear-gradient(135deg, rgba(16, 26, 51, 0.95) 0%, rgba(59, 129, 245, 0.95) 100%);

    .wrapper-title {
        text-align: center;
        margin-bottom: 3rem;

        h2 {
            font-size: 2.2rem;
            font-weight: ${({ theme }) => theme.FONTS_WEIGHT.BOLD};
            color: ${({ theme }) => theme.COLORS.WHITE_900};
            margin-bottom: 1rem;
            line-height: 1.3;

            ${up('md')} {
                font-size: 2.8rem;
            }
        }

        p {
            font-size: 1.4rem;
            color: ${({ theme }) => theme.COLORS.WHITE_600};
            line-height: 1.5;
            padding: 0 1rem;

            ${up('md')} {
                font-size: 1.6rem;
                padding: 0;
            }
        }
    }

    .products-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        max-width: 120rem;
        margin: 0 auto;

        ${up('md')} {
            grid-template-columns: repeat(2, 1fr);
        }

        ${up('lg')} {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    ${up('md')} {
        padding: 4rem 2rem;

        .wrapper-title {
            margin-bottom: 4rem;
        }
    }
`;
