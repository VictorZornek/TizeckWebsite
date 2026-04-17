'use client'

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
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
        cursor: pointer;

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

          &.status {
            span {
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.85rem;
              font-weight: 500;

              &.active {
                background: #d1fae5;
                color: #065f46;
              }

              &.blocked {
                background: #fee2e2;
                color: #991b1b;
              }
            }
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

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    max-width: 800px;
    max-height: 80vh;
    overflow-y: auto;
    width: 90%;

    ${media.down('md')} {
      padding: 1rem;
      width: 95%;
      max-height: 90vh;
    }

    h2 {
      color: #101a33;
      margin-bottom: 1.5rem;

      ${media.down('md')} {
        font-size: 1.25rem;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;

      ${media.down('md')} {
        grid-template-columns: 1fr;
      }

      .info-item {
        h4 {
          color: #6b7280;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }

        p {
          color: #101a33;
          font-weight: 500;
          word-break: break-word;
        }
      }
    }

    .close-btn {
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      width: 100%;

      &:hover {
        background: #4b5563;
      }
    }
  }
`;

interface Customer {
  _id: string;
  legacyId: number;
  name: string;
  fantasyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  cpfCnpj: string;
  blocked: string;
  address: string;
  neighborhood: string;
  zipCode: string;
  contact: string;
  notes: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    state: "",
    blocked: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
      });
      const response = await fetch(`/api/customers?${params}`);
      const data = await response.json();
      setCustomers(data.customers);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCustomers();
  };

  const handleClear = () => {
    setFilters({ search: "", city: "", state: "", blocked: "" });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <Container>
      <PageHeader title="Clientes Importados" />
      <Main>
        <Filters>
          <h3>Filtros</h3>
          <div className="filter-grid">
            <input
              type="text"
              placeholder="Buscar por nome, CPF/CNPJ, email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cidade"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
            <select
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            >
              <option value="">Todos os estados</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="MG">MG</option>
              <option value="AL">AL</option>
            </select>
            <select
              value={filters.blocked}
              onChange={(e) => setFilters({ ...filters, blocked: e.target.value })}
            >
              <option value="">Todos os status</option>
              <option value="A">Ativo</option>
              <option value="B">Bloqueado</option>
            </select>
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

        <Table>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Cidade/UF</th>
                <th>Telefone</th>
                <th>CPF/CNPJ</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Carregando...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} onClick={() => setSelectedCustomer(customer)}>
                    <td>{customer.legacyId}</td>
                    <td>{customer.name}</td>
                    <td>{customer.city}/{customer.state}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.cpfCnpj}</td>
                    <td className="status">
                      <span className={customer.blocked?.trim() === 'A' ? 'active' : 'blocked'}>
                        {customer.blocked?.trim() === 'A' ? 'Ativo' : 'Bloqueado'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Table>

        <Pagination>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Anterior
          </button>
          <span>
            Página {pagination.page} de {pagination.pages} ({pagination.total} clientes)
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.pages}
          >
            Próxima
          </button>
        </Pagination>
      </Main>

      <Modal isOpen={!!selectedCustomer}>
        <div className="modal-content">
          <h2>Detalhes do Cliente</h2>
          {selectedCustomer && (
            <div className="info-grid">
              <div className="info-item">
                <h4>Código</h4>
                <p>{selectedCustomer.legacyId}</p>
              </div>
              <div className="info-item">
                <h4>Nome</h4>
                <p>{selectedCustomer.name}</p>
              </div>
              <div className="info-item">
                <h4>Nome Fantasia</h4>
                <p>{selectedCustomer.fantasyName || '-'}</p>
              </div>
              <div className="info-item">
                <h4>CPF/CNPJ</h4>
                <p>{selectedCustomer.cpfCnpj || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Email</h4>
                <p>{selectedCustomer.email || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Telefone</h4>
                <p>{selectedCustomer.phone || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Endereço</h4>
                <p>{selectedCustomer.address || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Bairro</h4>
                <p>{selectedCustomer.neighborhood || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Cidade</h4>
                <p>{selectedCustomer.city || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Estado</h4>
                <p>{selectedCustomer.state || '-'}</p>
              </div>
              <div className="info-item">
                <h4>CEP</h4>
                <p>{selectedCustomer.zipCode || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Contato</h4>
                <p>{selectedCustomer.contact || '-'}</p>
              </div>
              {selectedCustomer.notes && (
                <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                  <h4>Observações</h4>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedCustomer.notes}</p>
                </div>
              )}
            </div>
          )}
          <button className="close-btn" onClick={() => setSelectedCustomer(null)}>
            Fechar
          </button>
        </div>
      </Modal>
    </Container>
  );
}
