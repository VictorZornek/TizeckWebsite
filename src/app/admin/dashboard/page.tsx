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
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    ${media.down('md')} {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    &:hover {
      background: #b91c1c;
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
    font-size: 1.5rem;

    ${media.down('md')} {
      font-size: 1.25rem;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  ${media.down('md')} {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
`;

const Card = styled.div`
  background: white;
  padding: 3rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h2 {
    color: #101a33;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    font-size: 1rem;
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
          <Card onClick={() => router.push("/admin/website")}>
            <div className="icon">🌐</div>
            <h2>Gerenciamento do Site</h2>
            <p>Gerencie produtos e categorias do site</p>
          </Card>
          <Card onClick={() => router.push("/admin/system")}>
            <div className="icon">💾</div>
            <h2>Backup e Sistema</h2>
            <p>Importação e gerenciamento de dados legados</p>
          </Card>
        </Grid>
      </Main>
    </Container>
  );
}