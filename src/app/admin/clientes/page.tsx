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
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
      background: #b91c1c;
    }
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    color: #101a33;
  }

  button {
    padding: 0.75rem 1.5rem;
    background: #3b81f5;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background: #2563eb;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;

  th, td {
    padding: 1.25rem 1.5rem;
    text-align: left;
  }

  th {
    background: linear-gradient(135deg, #3b81f5 0%, #2563eb 100%);
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: all 0.2s ease;

    &:hover {
      background: #f8fafc;
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(59, 129, 245, 0.1);
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    color: #374151;
    font-size: 0.95rem;
  }

  button {
    padding: 0.6rem 1.2rem;
    margin-right: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &.view {
      background: linear-gradient(135deg, #3b81f5 0%, #2563eb 100%);
      color: white;
    }

    &.edit {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    &.delete {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;

  h3 {
    margin-bottom: 1.5rem;
    color: #101a33;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;

    button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;

      &.save {
        background: #3b81f5;
        color: white;
        &:hover { background: #2563eb; }
      }

      &.cancel {
        background: #6b7280;
        color: white;
        &:hover { background: #4b5563; }
      }
    }
  }
`;

interface Client {
  _id: string;
  name: string;
  code: string;
  notes: string;
  createdAt: string;
}

export default function ClientesPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", notes: "" });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  const handleSubmit = async () => {
    if (editingClient) {
      await fetch(`/api/clients/${editingClient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setShowModal(false);
    setEditingClient(null);
    setFormData({ name: "", code: "", notes: "" });
    loadClients();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este cliente e todos os seus arquivos?")) {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      loadClients();
    }
  };

  const openModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({ name: client.name, code: client.code, notes: client.notes });
    } else {
      setEditingClient(null);
      setFormData({ name: "", code: "", notes: "" });
    }
    setShowModal(true);
  };

  return (
    <Container>
      <Header>
        <h1>Painel Administrativo</h1>
        <button onClick={() => router.push("/admin/dashboard")}>Voltar</button>
      </Header>
      <Main>
        <TopBar>
          <h2>Clientes</h2>
          <button onClick={() => openModal()}>Novo Cliente</button>
        </TopBar>
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.code || "-"}</td>
                <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="view" onClick={() => router.push(`/admin/clientes/${client._id}`)}>
                    Ver Arquivos
                  </button>
                  <button className="edit" onClick={() => openModal(client)}>
                    Editar
                  </button>
                  <button className="delete" onClick={() => handleDelete(client._id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Main>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{editingClient ? "Editar Cliente" : "Novo Cliente"}</h3>
            <input
              type="text"
              placeholder="Nome *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Código"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <textarea
              placeholder="Observações"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <div className="buttons">
              <button className="save" onClick={handleSubmit}>Salvar</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
