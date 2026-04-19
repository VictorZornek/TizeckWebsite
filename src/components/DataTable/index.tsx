'use client'

import { useState, useEffect } from "react";
import styled from "styled-components";
import * as media from "@/styles/media";

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;

  ${media.down('md')} {
    padding: 1rem;
  }
`;

const Filters = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  ${media.down('md')} {
    padding: 1rem;
  }

  h3 {
    color: #101a33;
    margin-bottom: 1rem;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;

    ${media.down('md')} {
      grid-template-columns: 1fr;
    }

    input, select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 0.9rem;
    }
  }

  .filter-actions {
    display: flex;
    gap: 1rem;

    ${media.down('md')} {
      flex-direction: column;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;

      ${media.down('md')} {
        width: 100%;
      }

      &.search {
        background: #3b82f6;
        color: white;

        &:hover {
          background: #2563eb;
        }
      }

      &.clear {
        background: #e5e7eb;
        color: #374151;

        &:hover {
          background: #d1d5db;
        }
      }
    }
  }
`;

const Table = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  ${media.down('md')} {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    ${media.down('md')} {
      min-width: 600px;
    }

    thead {
      background: #f9fafb;

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #374151;
        border-bottom: 2px solid #e5e7eb;

        ${media.down('md')} {
          padding: 0.75rem 0.5rem;
          font-size: 0.85rem;
        }
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

          ${media.down('md')} {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
        }
      }
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;

    ${media.down('md')} {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    &:hover:not(:disabled) {
      background: #f9fafb;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    color: #374151;

    ${media.down('md')} {
      font-size: 0.9rem;
      text-align: center;
    }
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: { value: string; label: string }[];
}

interface DataTableProps {
  title: string;
  apiEndpoint: string;
  columns: { key: string; label: string; format?: string }[];
  filters?: FilterConfig[];
}

export default function DataTable({ apiEndpoint, columns, filters = [] }: DataTableProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, limit: 50 });

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filterValues,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      const response = await fetch(`${apiEndpoint}?${params}`);
      const result = await response.json();
      
      if (result.data && result.pagination) {
        setData(result.data);
        setPagination(prev => ({ ...prev, ...result.pagination }));
      } else {
        setData(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setData([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchData();
  };

  const handleClear = () => {
    setFilterValues({});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatValue = (value: unknown, format?: string) => {
    if (!value && value !== 0) return '-';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
      case 'date':
        return new Date(value as string | number | Date).toLocaleDateString('pt-BR');
      case 'percent':
        return `${value}%`;
      default:
        return String(value);
    }
  };

  return (
    <Container>
      <Main>
        {filters.length > 0 && (
          <Filters>
            <h3>Filtros</h3>
            <div className="filter-grid">
              {filters.map((filter) => (
                filter.type === 'select' ? (
                  <select
                    key={filter.key}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => setFilterValues({ ...filterValues, [filter.key]: e.target.value })}
                  >
                    <option value="">{filter.label}</option>
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    key={filter.key}
                    type={filter.type}
                    placeholder={filter.label}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => setFilterValues({ ...filterValues, [filter.key]: e.target.value })}
                  />
                )
              ))}
            </div>
            <div className="filter-actions">
              <button className="search" onClick={handleSearch}>
                Buscar
              </button>
              <button className="clear" onClick={handleClear}>
                Limpar Filtros
              </button>
            </div>
          </Filters>
        )}

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

        {pagination.pages > 1 && (
          <Pagination>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Anterior
            </button>
            <span>
              Página {pagination.page} de {pagination.pages} ({pagination.total} registros)
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
            >
              Próxima
            </button>
          </Pagination>
        )}
      </Main>
    </Container>
  );
}
