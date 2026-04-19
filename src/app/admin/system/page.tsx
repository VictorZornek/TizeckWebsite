'use client'

import { useRouter } from "next/navigation";
import styled from "styled-components";
import * as media from "@/styles/media";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";

const Container = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#1a202c' : '#f5f5f5'};
  transition: background 0.3s ease;
`;

const Main = styled.main<{ $isDark: boolean }>`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  transition: color 0.3s ease;

  ${media.down('md')} {
    padding: 1rem;
  }

  h2 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 0.5rem;

    ${media.down('md')} {
      font-size: 1.25rem;
    }
  }

  .subtitle {
    color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
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
      color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
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

const Card = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  ${media.down('md')} {
    padding: 1.25rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, ${props => props.$isDark ? '0.4' : '0.15'});
  }

  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;

    ${media.down('md')} {
      font-size: 2rem;
    }
  }

  h4 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 0.5rem;
    font-size: 1.1rem;

    ${media.down('md')} {
      font-size: 1rem;
    }
  }

  p {
    color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
    font-size: 0.9rem;

    ${media.down('md')} {
      font-size: 0.85rem;
    }
  }
`;

export default function SystemPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Container $isDark={isDark}>
      <AdminHeader title="💾 Backup e Sistema" showBackButton />
      <Main $isDark={isDark}>
        <h2>Gerenciamento de dados legados</h2>
        <p className="subtitle">Importação e visualização de dados do sistema antigo</p>
        
        <div className="section">
          <h3>📥 Importação</h3>
          <Grid>
            <Card $isDark={isDark} onClick={() => router.push("/admin/import")}>
              <div className="icon">📥</div>
              <h4>Importação</h4>
              <p>Importe dados do banco Firebird</p>
            </Card>
          </Grid>
        </div>

        <div className="section">
          <h3>📄 Dados Principais</h3>
          <Grid>
            <Card $isDark={isDark} onClick={() => router.push("/admin/customers")}>
              <div className="icon">👥</div>
              <h4>Clientes</h4>
              <p>Visualize clientes importados</p>
            </Card>
            <Card $isDark={isDark} onClick={() => router.push("/admin/orders")}>
              <div className="icon">📋</div>
              <h4>Pedidos</h4>
              <p>Visualize pedidos importados</p>
            </Card>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/employees")}>
              <div className="icon">👤</div>
              <h4>Funcionários</h4>
              <p>Visualize funcionários/vendedores</p>
            </Card>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/regions")}>
              <div className="icon">🌍</div>
              <h4>Regiões</h4>
              <p>Visualize regiões de venda</p>
            </Card>
          </Grid>
        </div>

        <div className="section">
          <h3>💰 Financeiro</h3>
          <Grid>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/accounts")}>
              <div className="icon">💳</div>
              <h4>Contas</h4>
              <p>Contas a pagar/receber</p>
            </Card>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/payment-conditions")}>
              <div className="icon">💵</div>
              <h4>Condições Pagamento</h4>
              <p>Condições de pagamento</p>
            </Card>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/order-installments")}>
              <div className="icon">📅</div>
              <h4>Parcelas Pedidos</h4>
              <p>Parcelas dos pedidos</p>
            </Card>
          </Grid>
        </div>

        <div className="section">
          <h3>📦 Estoque e Histórico</h3>
          <Grid>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/stock-entries")}>
              <div className="icon">📥</div>
              <h4>Entradas Estoque</h4>
              <p>Histórico de entradas</p>
            </Card>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/customer-items")}>
              <div className="icon">📊</div>
              <h4>Histórico Clientes</h4>
              <p>Itens comprados por cliente</p>
            </Card>
          </Grid>
        </div>

        <div className="section">
          <h3>⚙️ Configurações</h3>
          <Grid>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/company-settings")}>
              <div className="icon">🏭</div>
              <h4>Dados da Empresa</h4>
              <p>Configurações da empresa</p>
            </Card>
            <Card $isDark={isDark} onClick={() => router.push("/admin/data/system-users")}>
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
