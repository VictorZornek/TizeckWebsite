'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import { Modal } from "@/components/Modal";
import { ConfirmModal } from "@/components/ConfirmModal";
import * as media from "@/styles/media";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";

const Container = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#1a202c' : '#f5f5f5'};
  transition: background 0.3s ease;
`;

const Header = styled.header<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  transition: background 0.3s ease;

  ${media.down('md')} {
    padding: 1rem;
  }

  h1 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    font-size: 1.5rem;

    ${media.down('md')} {
      font-size: 1.25rem;
      width: 100%;
    }
  }

  .actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    ${media.down('md')} {
      width: 100%;
      justify-content: stretch;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;

      ${media.down('md')} {
        flex: 1;
        padding: 0.6rem 0.8rem;
        font-size: 0.9rem;
      }

      &.back {
        background: ${props => props.$isDark ? '#4a5568' : '#6b7280'};
        color: white;

        &:hover {
          background: ${props => props.$isDark ? '#718096' : '#4b5563'};
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

  ${media.down('md')} {
    padding: 1rem;
  }
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

const CategoryList = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  transition: background 0.3s ease;
`;

const CategoryItem = styled.div<{ $isDark: boolean }>`
  padding: 1rem 2rem;
  border-bottom: 1px solid ${props => props.$isDark ? '#4a5568' : '#eee'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  ${media.down('md')} {
    padding: 1rem;
  }

  &:last-child {
    border-bottom: none;
  }

  .info {
    flex: 1;
    min-width: 200px;

    ${media.down('md')} {
      width: 100%;
      min-width: unset;
    }

    h3 {
      color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
      margin-bottom: 0.5rem;
    }

    p {
      color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
    }
  }

  .actions {
    display: flex;
    gap: 1rem;

    ${media.down('md')} {
      width: 100%;
      justify-content: stretch;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;

      ${media.down('md')} {
        flex: 1;
      }

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <Container $isDark={isDark}>
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
      <AdminHeader title="Gerenciar Categorias" showBackButton backPath="/admin/website" />
      <Header $isDark={isDark}>
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

        <CategoryList $isDark={isDark}>
          {categories.map((category) => (
            <CategoryItem key={category._id} $isDark={isDark}>
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