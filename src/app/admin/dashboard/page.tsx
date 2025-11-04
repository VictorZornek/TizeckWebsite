'use client'

import { useRouter } from "next/navigation";
import styled from "styled-components";

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

  h1 {
    color: #101a33;
  }

  button {
    padding: 0.5rem 1rem;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
      background: #b91c1c;
    }
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    color: #101a33;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }

  button {
    padding: 1rem 2rem;
    background: #3b81f5;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background: #2563eb;
    }
  }
`;

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <Container>
      <Header>
        <h1>Painel Administrativo</h1>
        <button onClick={handleLogout}>Sair</button>
      </Header>
      <Main>
        <h2>Bem-vindo ao painel de administração</h2>
        <Grid>
          <Card>
            <h2>Produtos</h2>
            <p>Gerencie todos os produtos do site</p>
            <button onClick={() => router.push("/admin/products")}>
              Gerenciar Produtos
            </button>
          </Card>
          <Card>
            <h2>Categorias</h2>
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