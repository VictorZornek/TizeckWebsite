'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import { Modal } from "@/components/Modal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Toast } from "@/components/Toast";
import * as media from "@/styles/media";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${media.down('md')} {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: #dc2626;
        &:hover { background: #b91c1c; }
      `;
    }
    if (props.$variant === 'secondary') {
      return `
        background: #6b7280;
        &:hover { background: #4b5563; }
      `;
    }
    return `
      background: #10b981;
      &:hover { background: #059669; }
    `;
  }}
`;

const Container = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#1a202c' : '#f5f5f5'};
  transition: background 0.3s ease;
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  ${media.down('md')} {
    padding: 1rem;
  }
`;

const Form = styled.form<{ $isDark?: boolean }>`
  h2 {
    margin-bottom: 1rem;
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
  }

  input, textarea {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid ${props => props.$isDark ? '#4a5568' : '#ddd'};
    border-radius: 0.5rem;
    font-size: 1rem;
    background: ${props => props.$isDark ? '#2d3748' : 'white'};
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
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

      .image-wrapper {
        position: relative;

        img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        .remove-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;

          &:hover {
            background: #b91c1c;
          }
        }
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
      position: relative;

      &.save {
        background: #10b981;
        color: white;

        &:hover:not(:disabled) {
          background: #059669;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        &.loading::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          margin-left: 8px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 0.6s linear infinite;
        }
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
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
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [originalImage, setOriginalImage] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      let imageUrl = formData.image;
      
      // Se há um arquivo pendente, fazer upload primeiro
      if (pendingFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", pendingFile);
        uploadFormData.append("uploadType", "category");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          setToast({ message: "Erro ao fazer upload da imagem", type: "error" });
          setIsLoading(false);
          return;
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
        
        // Se está editando e tinha imagem antiga, deletar
        if (editingId && originalImage && originalImage !== imageUrl) {
          try {
            await fetch("/api/upload/delete", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: originalImage }),
            });
          } catch (error) {
            console.error("Erro ao deletar imagem antiga:", error);
          }
        }
      }

      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        setToast({ 
          message: editingId ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!", 
          type: "success" 
        });
        handleCloseModal();
        fetchCategories();
      } else {
        setToast({ message: "Erro ao salvar categoria", type: "error" });
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      setToast({ message: "Erro ao salvar categoria", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
    });
    setOriginalImage(category.image);
    setPreviewUrl(category.image);
    setEditingId(category._id);
    setIsModalOpen(true);
  };

  const handleNewCategory = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setPendingFile(null);
    setPreviewUrl("");
    setOriginalImage("");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Limpar preview URL se for blob
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setPendingFile(null);
    setPreviewUrl("");
    setOriginalImage("");
    setFormData({
      name: "",
      description: "",
      image: "",
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setPendingFile(file);
    
    // Criar preview local
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    setFormData(prev => ({ ...prev, image: blobUrl }));
  };
  
  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPendingFile(null);
    setPreviewUrl("");
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const handleDeleteClick = (id: string, categoryName: string) => {
    setConfirmDelete({ id, name: categoryName });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/categories/${confirmDelete.id}`, { method: "DELETE" });
      const data = await response.json();
      
      if (response.ok) {
        setToast({ message: "Categoria e produtos deletados com sucesso!", type: "success" });
        fetchCategories();
      } else {
        const errorMsg = data.details 
          ? `Erro ao deletar arquivos do S3. Categoria não foi removida.`
          : data.error || "Erro ao deletar categoria";
        setToast({ message: errorMsg, type: "error" });
        console.error("Detalhes do erro:", data.details);
      }
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      setToast({ message: "Erro ao deletar categoria", type: "error" });
    } finally {
      setIsLoading(false);
      setConfirmDelete(null);
    }
  };

  return (
    <Container $isDark={isDark}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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
      <AdminHeader 
        title="Gerenciar Categorias" 
        showBackButton 
        backPath="/admin/website"
        customActions={
          <ActionButton $variant="primary" onClick={handleNewCategory}>
            + Nova Categoria
          </ActionButton>
        }
      />
      <Main>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <Form onSubmit={handleSubmit} $isDark={isDark}>
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
                onChange={handleImageSelect}
              />
              {previewUrl && (
                <div className="image-preview">
                  <div className="image-wrapper">
                    <Image src={previewUrl} alt="Preview" width={100} height={100} />
                    <button 
                      type="button" 
                      className="remove-btn" 
                      onClick={handleRemoveImage}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="submit" className={`save ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                {isLoading ? 'Salvando...' : editingId ? "Atualizar" : "Criar"} Categoria
              </button>
              <button type="button" className="cancel" onClick={handleCloseModal} disabled={isLoading}>
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
                <button className="edit" onClick={() => handleEdit(category)} disabled={isLoading}>
                  Editar
                </button>
                <button className="delete" onClick={() => handleDeleteClick(category._id, category.name)} disabled={isLoading}>
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