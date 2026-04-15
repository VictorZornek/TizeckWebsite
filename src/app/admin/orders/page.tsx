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

const Filters = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h3 {
    color: #101a33;
    margin-bottom: 1rem;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;

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

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;

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
        cursor: pointer;

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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;

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

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    max-width: 900px;
    max-height: 80vh;
    overflow-y: auto;
    width: 90%;

    h2 {
      color: #101a33;
      margin-bottom: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;

      .info-item {
        h4 {
          color: #6b7280;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }

        p {
          color: #101a33;
          font-weight: 500;
        }
      }
    }

    .items-section {
      h3 {
        color: #101a33;
        margin-bottom: 1rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
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

      &:hover {
        background: #4b5563;
      }
    }
  }
`;

interface Order {
  _id: string;
  legacyId: number;
  customerId: { name: string };
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
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
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
      console.log('Pedidos recebidos:', data.orders[0]); // Debug
      setOrders(data.orders);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
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
    <Container>
      <Header>
        <h1>Pedidos Importados</h1>
        <button onClick={() => router.push("/admin/dashboard")}>
          Voltar ao Dashboard
        </button>
      </Header>
      <Main>
        <Filters>
          <h3>Filtros</h3>
          <div className="filter-grid">
            <input
              type="text"
              placeholder="Buscar por código do pedido ou cliente..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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

        <Table>
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
                  <tr key={order._id} onClick={() => {
                    console.log('Clicou no pedido:', order.legacyId, 'Items:', order.items);
                    setSelectedOrder(order);
                  }}>
                    <td>#{order.legacyId}</td>
                    <td>{order.customerId?.name || 'Cliente não encontrado'}</td>
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

        <Pagination>
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

      <Modal isOpen={!!selectedOrder}>
        <div className="modal-content">
          <h2>Detalhes do Pedido #{selectedOrder?.legacyId}</h2>
          {selectedOrder && (
            <>
              {console.log('Modal - Items:', selectedOrder.items)}
              <div className="info-grid">
                <div className="info-item">
                  <h4>Cliente</h4>
                  <p>{selectedOrder.customerId?.name || '-'}</p>
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
