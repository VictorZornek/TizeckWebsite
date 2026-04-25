'use client'

import { useState, useEffect } from "react";
import styled from "styled-components";
import * as media from "@/styles/media";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";

const Container = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#1a202c' : '#f5f5f5'};
  transition: background 0.3s ease;
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  ${media.down('md')} {
    padding: 1rem;
  }
`;

const Filters = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  ${media.down('md')} {
    padding: 1rem;
  }

  h3 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
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
      border: 1px solid ${props => props.$isDark ? '#4a5568' : '#ddd'};
      border-radius: 0.5rem;
      font-size: 0.9rem;
      background: ${props => props.$isDark ? '#1a202c' : 'white'};
      color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
      transition: all 0.3s ease;
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
      transition: all 0.3s ease;

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
        background: ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};
        color: ${props => props.$isDark ? '#f7fafc' : '#374151'};

        &:hover {
          background: ${props => props.$isDark ? '#718096' : '#d1d5db'};
        }
      }
    }
  }
`;

const Table = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  overflow: hidden;
  transition: all 0.3s ease;

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
      background: ${props => props.$isDark ? '#1a202c' : '#f9fafb'};

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: ${props => props.$isDark ? '#cbd5e0' : '#374151'};
        border-bottom: 2px solid ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};

        ${media.down('md')} {
          padding: 0.75rem 0.5rem;
          font-size: 0.85rem;
        }
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
          background: ${props => props.$isDark ? '#374151' : '#f9fafb'};
        }

        td {
          padding: 1rem;
          color: ${props => props.$isDark ? '#e5e7eb' : '#374151'};

          ${media.down('md')} {
            padding: 0.75rem 0.5rem;
            font-size: 0.85rem;
          }
        }
      }
    }
  }
`;

const Pagination = styled.div<{ $isDark: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid ${props => props.$isDark ? '#4a5568' : '#ddd'};
    border-radius: 0.5rem;
    background: ${props => props.$isDark ? '#2d3748' : 'white'};
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    cursor: pointer;
    transition: all 0.3s ease;

    ${media.down('md')} {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    &:hover:not(:disabled) {
      background: ${props => props.$isDark ? '#374151' : '#f9fafb'};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    color: ${props => props.$isDark ? '#e5e7eb' : '#374151'};

    ${media.down('md')} {
      font-size: 0.9rem;
      text-align: center;
    }
  }
`;

const Modal = styled.div<{ isOpen: boolean; $isDark: boolean }>`
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
    background: ${props => props.$isDark ? '#2d3748' : 'white'};
    padding: 2rem;
    border-radius: 1rem;
    max-width: 900px;
    max-height: 80vh;
    overflow-y: auto;
    width: 90%;
    transition: all 0.3s ease;

    ${media.down('md')} {
      padding: 1rem;
      width: 95%;
      max-height: 90vh;
    }

    h2 {
      color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
      margin-bottom: 1.5rem;

      ${media.down('md')} {
        font-size: 1.25rem;
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;

      ${media.down('md')} {
        grid-template-columns: 1fr;
      }

      .info-item {
        h4 {
          color: ${props => props.$isDark ? '#cbd5e0' : '#6b7280'};
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }

        p {
          color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
          font-weight: 500;
          word-break: break-word;
        }
      }
    }

    .items-section {
      h3 {
        color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
        margin-bottom: 1rem;

        ${media.down('md')} {
          font-size: 1.1rem;
        }
      }

      table {
        width: 100%;
        border-collapse: collapse;
        overflow-x: auto;
        display: block;

        ${media.down('md')} {
          font-size: 0.85rem;
        }

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};

          ${media.down('md')} {
            padding: 0.5rem;
          }
        }

        th {
          background: ${props => props.$isDark ? '#1a202c' : '#f9fafb'};
          font-weight: 600;
          color: ${props => props.$isDark ? '#cbd5e0' : '#374151'};
        }

        td {
          color: ${props => props.$isDark ? '#e5e7eb' : '#374151'};
        }
      }
    }

    .close-btn {
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: ${props => props.$isDark ? '#4a5568' : '#6b7280'};
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      width: 100%;
      transition: all 0.3s ease;

      &:hover {
        background: ${props => props.$isDark ? '#718096' : '#4b5563'};
      }
    }
  }
`;

interface Order {
  _id: string;
  legacyId: number;
  customer: { name: string; fantasyName: string } | null;
  customerLegacyId: number;
  orderDate: string;
  totalAmount: number;
  totalItems: number;
  status: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page.toString(),
      });
      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();
      setOrders(data.orders || []);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setOrders([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  const handleClear = () => {
    setFilters({ search: "", status: "", dateFrom: "", dateTo: "" });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => fetchOrders(), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <Container $isDark={isDark}>
      <AdminHeader title="Pedidos Importados" showBackButton backPath="/admin/system" />
      <Main>
        <Filters $isDark={isDark}>
          <h3>Filtros</h3>
          <div className="filter-grid">
            <input
              type="text"
              placeholder="Buscar por código do pedido ou cliente..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Todos os status</option>
              <option value="E">Entregue</option>
              <option value="P">Pendente</option>
              <option value="C">Cancelado</option>
            </select>
            <input
              type="date"
              placeholder="Data inicial"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
            <input
              type="date"
              placeholder="Data final"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
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

        <Table $isDark={isDark}>
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
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
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} onClick={() => setSelectedOrder(order)}>
                    <td>#{order.legacyId}</td>
                    <td>{order.customer?.name || order.customer?.fantasyName || `Cliente #${order.customerLegacyId}`}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{order.totalItems}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Table>

        <Pagination $isDark={isDark}>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Anterior
          </button>
          <span>
            Página {pagination.page} de {pagination.pages} ({pagination.total} pedidos)
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.pages}
          >
            Próxima
          </button>
        </Pagination>
      </Main>

      <Modal isOpen={!!selectedOrder} $isDark={isDark}>
        <div className="modal-content">
          <h2>Detalhes do Pedido #{selectedOrder?.legacyId}</h2>
          {selectedOrder && (
            <>
              <div className="info-grid">
                <div className="info-item">
                  <h4>Cliente</h4>
                  <p>{selectedOrder.customer?.name || selectedOrder.customer?.fantasyName || `Cliente #${selectedOrder.customerLegacyId}`}</p>
                </div>
                <div className="info-item">
                  <h4>Data</h4>
                  <p>{formatDate(selectedOrder.orderDate)}</p>
                </div>
                <div className="info-item">
                  <h4>Status</h4>
                  <p>{selectedOrder.status}</p>
                </div>
                <div className="info-item">
                  <h4>Total de Itens</h4>
                  <p>{selectedOrder.totalItems}</p>
                </div>
                <div className="info-item">
                  <h4>Valor Total</h4>
                  <p>{formatCurrency(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              <div className="items-section">
                <h3>Itens do Pedido</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Valor Unit.</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.unitPrice)}</td>
                          <td>{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    Nenhum item encontrado neste pedido
                  </p>
                )}
              </div>
            </>
          )}
          <button className="close-btn" onClick={() => setSelectedOrder(null)}>
            Fechar
          </button>
        </div>
      </Modal>
    </Container>
  );
}
