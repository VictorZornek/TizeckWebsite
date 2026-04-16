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
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background: #6b7280;
    color: white;

    &:hover {
      background: #4b5563;
    }
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    color: #101a33;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
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
    width: 100%;

    &:hover {
      background: #2563eb;
    }
  }
`;

export default function SystemPage() {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <h1>💾 Backup e Sistema</h1>
        <button onClick={() => router.push("/admin/dashboard")}>
          Voltar ao Dashboard
        </button>
      </Header>
      <Main>
        <h2>Gerenciamento de dados legados</h2>
        <p className="subtitle">Importação e visualização de dados do sistema antigo</p>
        <Grid>
          <Card>
            <div className="icon">📥</div>
            <h3>Importação</h3>
            <p>Importe dados do banco legado Firebird</p>
            <button onClick={() => router.push("/admin/import")}>
              Importar Banco Legado
            </button>
          </Card>
          <Card>
            <div className="icon">👥</div>
            <h3>Clientes</h3>
            <p>Visualize os clientes importados</p>
            <button onClick={() => router.push("/admin/customers")}>
              Ver Clientes
            </button>
          </Card>
          <Card>
            <div className="icon">📋</div>
            <h3>Pedidos</h3>
            <p>Visualize os pedidos importados</p>
            <button onClick={() => router.push("/admin/orders")}>
              Ver Pedidos
            </button>
          </Card>
        </Grid>
      </Main>
    </Container>
  );
}
