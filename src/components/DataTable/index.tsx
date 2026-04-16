'use client'

import { useState, useEffect } from "react";
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
  max-width: 1400px;
  margin: 0 auto;
`;

const Table = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: #f9fafb;

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #374151;
        border-bottom: 2px solid #e5e7eb;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid #e5e7eb;

        &:hover {
          background: #f9fafb;
        }

        td {
          padding: 1rem;
          color: #374151;
        }
      }
    }
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

interface DataTableProps {
  title: string;
  apiEndpoint: string;
  columns: { key: string; label: string; format?: string }[];
}

export default function DataTable({ title, apiEndpoint, columns }: DataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(apiEndpoint);
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setData([]);
    }
    setLoading(false);
  };

  const formatValue = (value: any, format?: string) => {
    if (!value && value !== 0) return '-';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString('pt-BR');
      case 'percent':
        return `${value}%`;
      default:
        return value;
    }
  };

  return (
    <Container>
      <Header>
        <h1>{title}</h1>
        <button onClick={() => router.push("/admin/system")}>
          Voltar
        </button>
      </Header>
      <Main>
        <Table>
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length}>
                    <Loading>Carregando...</Loading>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <Loading>Nenhum registro encontrado</Loading>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {formatValue(row[col.key], col.format)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Table>
      </Main>
    </Container>
  );
}
