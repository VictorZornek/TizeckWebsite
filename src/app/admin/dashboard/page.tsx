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
  max-width: 1200px;
  margin: 0 auto;

  ${media.down('md')} {
    padding: 1rem;
  }

  h2 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    font-size: 1.5rem;
    transition: color 0.3s ease;

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

const Card = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 3rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, ${props => props.$isDark ? '0.4' : '0.15'});
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h2 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
    font-size: 1rem;
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Container $isDark={isDark}>
      <AdminHeader title="Painel Administrativo" showLogoutButton />
      <Main $isDark={isDark}>
        <h2>Bem-vindo ao painel de administração</h2>
        <Grid>
          <Card $isDark={isDark} onClick={() => router.push("/admin/website")}>
            <div className="icon">🌐</div>
            <h2>Gerenciamento do Site</h2>
            <p>Gerencie produtos e categorias do site</p>
          </Card>
          <Card $isDark={isDark} onClick={() => router.push("/admin/system")}>
            <div className="icon">💾</div>
            <h2>Backup e Sistema</h2>
            <p>Importação e gerenciamento de dados legados</p>
          </Card>
        </Grid>
      </Main>
    </Container>
  );
}
