'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import { Modal } from "@/components/Modal";
import { ConfirmModal } from "@/components/ConfirmModal";

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

  .actions {
    display: flex;
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;

      &.back {
        background: #6b7280;
        color: white;

        &:hover {
          background: #4b5563;
        }
      }

      &.new {
        background: #10b981;
        color: white;

        &:hover {
          background: #059669;
        }
      }
    }
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Form = styled.form`
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

  .image-upload {
    margin-bottom: 1rem;

    input[type="file"] {
      margin-bottom: 0.5rem;
    }

    .image-preview {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 0.5rem;
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    button {
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;

      &.save {
        background: #10b981;
        color: white;

        &:hover {
          background: #059669;
        }
      }

      &.cancel {
        background: #6b7280;
        color: white;

        &:hover {
          background: #4b5563;
        }
      }
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
    flex: 1;

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
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
        handleCloseModal();
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
    setIsModalOpen(true);
  };

  const handleNewCategory = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      image: "",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: string, categoryName: string) => {
    setConfirmDelete({ id, name: categoryName });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    
    try {
      await fetch(`/api/categories/${confirmDelete.id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <Container>
      <ConfirmModal
        isOpen={!!confirmDelete}
        title="ATENÇÃO: Ação Irreversível"
        message={`
          <p>Você está prestes a deletar a categoria <strong>"${confirmDelete?.name}"</strong>.</p>
          <ul>
            <li>Remover TODOS os produtos desta categoria</li>
            <li>Deletar TODAS as imagens associadas do S3</li>
            <li>Esta ação é IRREVERSÍVEL</li>
          </ul>
          <div class="warning">Tem certeza que deseja continuar?</div>
        `}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
      <Header>
        <h1>Gerenciar Categorias</h1>
        <div className="actions">
          <button className="new" onClick={handleNewCategory}>
            + Nova Categoria
          </button>
          <button className="back" onClick={() => router.push("/admin/dashboard")}>
            Voltar ao Dashboard
          </button>
        </div>
      </Header>
      <Main>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
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
            
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p>Fazendo upload...</p>}
              {formData.image && (
                <div className="image-preview">
                  <Image src={formData.image} alt="Preview" width={100} height={100} />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save">
                {editingId ? "Atualizar" : "Criar"} Categoria
              </button>
              <button type="button" className="cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
            </div>
          </Form>
        </Modal>

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
                <button className="delete" onClick={() => handleDeleteClick(category._id, category.name)}>
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