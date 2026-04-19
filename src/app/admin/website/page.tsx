'use client'

import { useRouter } from "next/navigation";
import styled from "styled-components";
import * as media from "@/styles/media";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { Package, Tag } from "lucide-react";

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

const Card = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  text-align: center;
  transition: all 0.3s ease;

  ${media.down('md')} {
    padding: 1.5rem;
  }

  .icon {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    color: #3b82f6;

    ${media.down('md')} {
      margin-bottom: 0.75rem;
    }
  }

  h3 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 1rem;

    ${media.down('md')} {
      font-size: 1.1rem;
    }
  }

  p {
    color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
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
    transition: all 0.3s ease;

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Container $isDark={isDark}>
      <AdminHeader title="Gerenciamento do Site" showBackButton />
      <Main $isDark={isDark}>
        <h2>Gerencie o conteúdo do site</h2>
        <p className="subtitle">Produtos e categorias exibidos para os clientes</p>
        <Grid>
          <Card $isDark={isDark}>
            <div className="icon"><Package size={48} /></div>
            <h3>Produtos</h3>
            <p>Gerencie todos os produtos do site</p>
            <button onClick={() => router.push("/admin/products")}>
              Gerenciar Produtos
            </button>
          </Card>
          <Card $isDark={isDark}>
            <div className="icon"><Tag size={48} /></div>
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
