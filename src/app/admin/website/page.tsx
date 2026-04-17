'use client'

import { useRouter } from "next/navigation";
import styled from "styled-components";
import * as media from "@/styles/media";

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  ${media.down('md')} {
    padding: 1rem;
  }

  h1 {
    color: #101a33;
    font-size: 1.5rem;

    ${media.down('md')} {
      font-size: 1.25rem;
    }
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background: #6b7280;
    color: white;

    ${media.down('md')} {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    &:hover {
      background: #4b5563;
    }
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  ${media.down('md')} {
    padding: 1rem;
  }

  h2 {
    color: #101a33;
    margin-bottom: 0.5rem;

    ${media.down('md')} {
      font-size: 1.25rem;
    }
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;

    ${media.down('md')} {
      font-size: 0.9rem;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  ${media.down('md')} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  ${media.down('md')} {
    padding: 1.5rem;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;

    ${media.down('md')} {
      font-size: 2.5rem;
    }
  }

  h3 {
    color: #101a33;
    margin-bottom: 1rem;

    ${media.down('md')} {
      font-size: 1.1rem;
    }
  }

  p {
    color: #666;
    margin-bottom: 2rem;

    ${media.down('md')} {
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
  }

  button {
    padding: 1rem 2rem;
    background: #3b81f5;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;

    ${media.down('md')} {
      padding: 0.8rem 1.5rem;
      font-size: 0.9rem;
    }

    &:hover {
      background: #2563eb;
    }
  }
`;

export default function WebsitePage() {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <h1>🌐 Gerenciamento do Site</h1>
        <button onClick={() => router.push("/admin/dashboard")}>
          Voltar ao Dashboard
        </button>
      </Header>
      <Main>
        <h2>Gerencie o conteúdo do site</h2>
        <p className="subtitle">Produtos e categorias exibidos para os clientes</p>
        <Grid>
          <Card>
            <div className="icon">📦</div>
            <h3>Produtos</h3>
            <p>Gerencie todos os produtos do site</p>
            <button onClick={() => router.push("/admin/products")}>
              Gerenciar Produtos
            </button>
          </Card>
          <Card>
            <div className="icon">🏷️</div>
            <h3>Categorias</h3>
            <p>Gerencie as categorias de produtos</p>
            <button onClick={() => router.push("/admin/categories")}>
              Gerenciar Categorias
            </button>
          </Card>
        </Grid>
      </Main>
    </Container>
  );
}
