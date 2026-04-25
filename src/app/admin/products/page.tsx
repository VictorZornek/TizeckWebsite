'use client'

import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Modal } from "@/components/Modal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Toast } from "@/components/Toast";
import { SpecificationsEditor } from "@/components/SpecificationsEditor";
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

const Filters = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;

  ${media.down('md')} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input<{ $isDark: boolean }>`
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.$isDark ? '#4a5568' : '#ddd'};
  border-radius: 0.5rem;
  background: ${props => props.$isDark ? '#1a202c' : 'white'};
  color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &::placeholder {
    color: ${props => props.$isDark ? '#a0aec0' : '#999'};
  }

  ${media.down('md')} {
    width: 100%;
  }
`;

const CategoryFilter = styled.select<{ $isDark: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.$isDark ? '#4a5568' : '#ddd'};
  border-radius: 0.5rem;
  background: ${props => props.$isDark ? '#1a202c' : 'white'};
  color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  ${media.down('md')} {
    width: 100%;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h2<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProductCount = styled.span<{ $isDark: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.$isDark ? '#a0aec0' : '#6b7280'};
  font-weight: normal;
`;

const EmptyState = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  color: ${props => props.$isDark ? '#a0aec0' : '#6b7280'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});

  p {
    font-size: 1.1rem;
    margin: 0;
  }
`;

const Form = styled.form<{ $isDark: boolean }>`
  h2 {
    margin-bottom: 1rem;
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
  }

  input, textarea, select {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid ${props => props.$isDark ? '#4a5568' : '#ddd'};
    border-radius: 0.5rem;
    font-size: 1rem;
    background: ${props => props.$isDark ? '#1a202c' : 'white'};
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

      &.save {
        background: #10b981;
        color: white;
        position: relative;

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

const ProductList = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  transition: background 0.3s ease;
`;

const ProductItem = styled.div<{ $isDark: boolean }>`
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
      margin-bottom: 0.25rem;
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

        &:hover:not(:disabled) {
          background: #d97706;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      &.delete {
        background: #dc2626;
        color: white;

        &:hover:not(:disabled) {
          background: #b91c1c;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }
`;

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  specifications: Record<string, string | number | boolean>;
  activated: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    images: [] as string[],
    specifications: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setPendingFiles(prev => [...prev, ...newFiles]);
    
    const previewUrls = newFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...previewUrls]
    }));
  };

  const handleRemoveImage = (index: number) => {
    const imageUrl = formData.images[index];
    
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
      const fileIndex = index - originalImages.length;
      setPendingFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      let productId = editingId;
      
      if (!editingId) {
        const specifications = formData.specifications 
          ? JSON.parse(formData.specifications) 
          : {};

        const createResponse = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            images: [],
            specifications,
          }),
        });

        if (!createResponse.ok) {
          setToast({ message: "Erro ao criar produto", type: "error" });
          setIsLoading(false);
          return;
        }

        const newProduct = await createResponse.json();
        productId = newProduct._id;
      }

      const uploadedUrls: string[] = [];
      
      for (const file of pendingFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("category", formData.category);
        uploadFormData.append("productName", formData.name);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          setToast({ message: "Erro ao fazer upload da imagem", type: "error" });
          setIsLoading(false);
          return;
        }
      }

      const finalImages = formData.images
        .filter(img => !img.startsWith('blob:'))
        .concat(uploadedUrls);

      if (editingId) {
        const imagesToDelete = originalImages.filter(img => !finalImages.includes(img));
        for (const imageUrl of imagesToDelete) {
          try {
            await fetch("/api/upload/delete", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl }),
            });
          } catch (error) {
            console.error("Erro ao deletar imagem:", error);
          }
        }

        const specifications = formData.specifications 
          ? JSON.parse(formData.specifications) 
          : {};

        const response = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            images: finalImages,
            specifications,
          }),
        });

        if (response.ok) {
          setToast({ message: "Produto atualizado com sucesso!", type: "success" });
          handleCloseModal();
          fetchProducts();
        } else {
          setToast({ message: "Erro ao atualizar produto", type: "error" });
        }
      } else {
        const specifications = formData.specifications 
          ? JSON.parse(formData.specifications) 
          : {};

        const response = await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            images: finalImages,
            specifications,
          }),
        });

        if (response.ok) {
          setToast({ message: "Produto criado com sucesso!", type: "success" });
          handleCloseModal();
          fetchProducts();
        } else {
          setToast({ message: "Erro ao criar produto", type: "error" });
        }
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setToast({ message: "Erro ao salvar produto", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      images: product.images,
      specifications: JSON.stringify(product.specifications, null, 2),
    });
    setOriginalImages(product.images);
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  const handleNewProduct = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      images: [],
      specifications: "",
    });
    setPendingFiles([]);
    setOriginalImages([]);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    formData.images.forEach(img => {
      if (img.startsWith('blob:')) {
        URL.revokeObjectURL(img);
      }
    });
    setIsModalOpen(false);
    setEditingId(null);
    setPendingFiles([]);
    setOriginalImages([]);
    setFormData({
      name: "",
      description: "",
      category: "",
      images: [],
      specifications: "",
    });
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productToDelete}`, { method: "DELETE" });
      const data = await response.json();
      
      if (response.ok) {
        setToast({ message: "Produto e imagens deletados com sucesso!", type: "success" });
        fetchProducts();
      } else {
        const errorMsg = data.details 
          ? `Erro ao deletar imagens do S3. Produto não foi removido.`
          : data.error || "Erro ao deletar produto";
        setToast({ message: errorMsg, type: "error" });
        console.error("Detalhes do erro:", data.details);
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      setToast({ message: "Erro ao deletar produto", type: "error" });
    }
    setIsLoading(false);
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Container $isDark={isDark}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        message="Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita."
      />
      <AdminHeader 
        title="Gerenciar Produtos" 
        showBackButton 
        backPath="/admin/website"
        customActions={
          <ActionButton $variant="primary" onClick={handleNewProduct}>
            + Novo Produto
          </ActionButton>
        }
      />
      <Main>
        <Filters $isDark={isDark}>
          <SearchInput
            $isDark={isDark}
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CategoryFilter
            $isDark={isDark}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </CategoryFilter>
        </Filters>

        {filteredProducts.length === 0 ? (
          <EmptyState $isDark={isDark}>
            <p>Nenhum produto encontrado</p>
          </EmptyState>
        ) : (
          Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
            <CategorySection key={categoryName}>
              <CategoryTitle $isDark={isDark}>
                {categoryName}
                <ProductCount $isDark={isDark}>({categoryProducts.length})</ProductCount>
              </CategoryTitle>
              <ProductList $isDark={isDark}>
                {categoryProducts.map((product) => (
                  <ProductItem key={product._id} $isDark={isDark}>
                    <div className="info">
                      <h3>{product.name}</h3>
                      <p><strong>Categoria:</strong> {product.category}</p>
                      <p>{product.description}</p>
                    </div>
                    <div className="actions">
                      <button className="edit" onClick={() => handleEdit(product)} disabled={isLoading}>
                        Editar
                      </button>
                      <button className="delete" onClick={() => handleDelete(product._id)} disabled={isLoading}>
                        {isLoading ? 'Processando...' : 'Deletar'}
                      </button>
                    </div>
                  </ProductItem>
                ))}
              </ProductList>
            </CategorySection>
          ))
        )}

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <Form $isDark={isDark} onSubmit={handleSubmit}>
            <h2>{editingId ? "Editar Produto" : "Novo Produto"}</h2>
            <input
              type="text"
              placeholder="Nome do produto"
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
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <div className="image-upload">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="image-preview">
                {formData.images.map((url, index) => (
                  <div key={index} className="image-wrapper">
                    <Image src={url} alt={`Preview ${index}`} width={100} height={100} />
                    <button 
                      type="button" 
                      className="remove-btn" 
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <SpecificationsEditor
              value={formData.specifications}
              onChange={(value) => setFormData({ ...formData, specifications: value })}
              isDark={isDark}
            />
            
            <div className="form-actions">
              <button type="submit" className={`save ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                {isLoading ? 'Salvando...' : editingId ? "Atualizar Produto" : "Criar Produto"}
              </button>
              <button type="button" className="cancel" onClick={handleCloseModal} disabled={isLoading}>
                Cancelar
              </button>
            </div>
          </Form>
        </Modal>
      </Main>
    </Container>
  );
}
