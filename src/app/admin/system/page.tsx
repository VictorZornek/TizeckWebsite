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
  max-width: 1400px;
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

  .section {
    margin-bottom: 3rem;

    ${media.down('md')} {
      margin-bottom: 2rem;
    }

    h3 {
      color: #101a33;
      margin-bottom: 1rem;
      font-size: 1.2rem;

      ${media.down('md')} {
        font-size: 1.1rem;
      }
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  ${media.down('md')} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  ${media.down('md')} {
    padding: 1.25rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;

    ${media.down('md')} {
      font-size: 2rem;
    }
  }

  h4 {
    color: #101a33;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;

    ${media.down('md')} {
      font-size: 1rem;
    }
  }

  p {
    color: #666;
    font-size: 0.9rem;

    ${media.down('md')} {
      font-size: 0.85rem;
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
        
        <div className="section">
          <h3>📥 Importação</h3>
          <Grid>
            <Card onClick={() => router.push("/admin/import")}>
              <div className="icon">📥</div>
              <h4>Importação</h4>
              <p>Importe dados do banco Firebird</p>
            </Card>
          </Grid>
        </div>

        <div className="section">
          <h3>📄 Dados Principais</h3>
          <Grid>
            <Card onClick={() => router.push("/admin/customers")}>
              <div className="icon">👥</div>
              <h4>Clientes</h4>
              <p>Visualize clientes importados</p>
            </Card>
            <Card onClick={() => router.push("/admin/orders")}>
              <div className="icon">📋</div>
              <h4>Pedidos</h4>
              <p>Visualize pedidos importados</p>
            </Card>
            <Card onClick={() => router.push("/admin/data/employees")}>
              <div className="icon">👤</div>
              <h4>Funcionários</h4>
              <p>Visualize funcionários/vendedores</p>
            </Card>
            <Card onClick={() => router.push("/admin/data/regions")}>
              <div className="icon">🌍</div>
              <h4>Regiões</h4>
              <p>Visualize regiões de venda</p>
            </Card>
          </Grid>
        </div>

        <div className="section">
          <h3>💰 Financeiro</h3>
          <Grid>
            <Card onClick={() => router.push("/admin/data/accounts")}>
              <div className="icon">💳</div>
              <h4>Contas</h4>
              <p>Contas a pagar/receber</p>
            </Card>
            <Card onClick={() => router.push("/admin/data/payment-conditions")}>
              <div className="icon">💵</div>
              <h4>Condições Pagamento</h4>
              <p>Condições de pagamento</p>
            </Card>
            <Card onClick={() => router.push("/admin/data/order-installments")}>
              <div className="icon">📅</div>
              <h4>Parcelas Pedidos</h4>
              <p>Parcelas dos pedidos</p>
            </Card>
          </Grid>
        </div>

        <div className="section">
          <h3>📦 Estoque e Histórico</h3>
          <Grid>
            <Card onClick={() => router.push("/admin/data/stock-entries")}>
              <div className="icon">📥</div>
              <h4>Entradas Estoque</h4>
              <p>Histórico de entradas</p>
            </Card>
            <Card onClick={() => router.push("/admin/data/customer-items")}>
              <div className="icon">📊</div>
              <h4>Histórico Clientes</h4>
              <p>Itens comprados por cliente</p>
            </Card>
          </Grid>
        </div>

        <div className="section">
          <h3>⚙️ Configurações</h3>
          <Grid>
            <Card onClick={() => router.push("/admin/data/company-settings")}>
              <div className="icon">🏭</div>
              <h4>Dados da Empresa</h4>
              <p>Configurações da empresa</p>
            </Card>
            <Card onClick={() => router.push("/admin/data/system-users")}>
              <div className="icon">🔑</div>
              <h4>Usuários Sistema</h4>
              <p>Usuários do sistema legado</p>
            </Card>
          </Grid>
        </div>
      </Main>
    </Container>
  );
}
