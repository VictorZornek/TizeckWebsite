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
    background: #3b81f5;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
      background: #2563eb;
    }
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    color: #101a33;
  }

  input, textarea {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  textarea {
    height: 100px;
    resize: vertical;
  }

  button {
    padding: 1rem 2rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
      background: #059669;
    }
  }
`;

const CategoryList = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CategoryItem = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  .info {
    h3 {
      color: #101a33;
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
    }
  }

  .actions {
    display: flex;
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;

      &.edit {
        background: #f59e0b;
        color: white;

        &:hover {
          background: #d97706;
        }
      }

      &.delete {
        background: #dc2626;
        color: white;

        &:hover {
          background: #b91c1c;
        }
      }
    }
  }
`;

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  activated: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", description: "", image: "" });
        setEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
    });
    setEditingId(category._id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        await fetch(`/api/categories/${id}`, { method: "DELETE" });
        fetchCategories();
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <h1>Gerenciar Categorias</h1>
        <button onClick={() => router.push("/admin/dashboard")}>
          Voltar ao Dashboard
        </button>
      </Header>
      <Main>
        <Form onSubmit={handleSubmit}>
          <h2>{editingId ? "Editar Categoria" : "Nova Categoria"}</h2>
          <input
            type="text"
            placeholder="Nome da categoria"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="URL da imagem"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <button type="submit">
            {editingId ? "Atualizar" : "Criar"} Categoria
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: "", description: "", image: "" });
              }}
              style={{ marginLeft: "1rem", background: "#6b7280" }}
            >
              Cancelar
            </button>
          )}
        </Form>

        <CategoryList>
          {categories.map((category) => (
            <CategoryItem key={category._id}>
              <div className="info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <div className="actions">
                <button className="edit" onClick={() => handleEdit(category)}>
                  Editar
                </button>
                <button className="delete" onClick={() => handleDelete(category._id)}>
                  Deletar
                </button>
              </div>
            </CategoryItem>
          ))}
        </CategoryList>
      </Main>
    </Container>
  );
}