'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import { Modal } from "@/components/Modal";
import { Toast } from "@/components/Toast";

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

  input, textarea, select {
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

const ProductList = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProductItem = styled.div`
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
      margin-bottom: 0.25rem;
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
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const router = useRouter();

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
    
    setUploading(true);
    setIsLoading(true);

    try {
      // Criar produto primeiro para obter o ID
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
          setUploading(false);
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
        uploadFormData.append("productId", productId!);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          setToast({ message: "Erro ao fazer upload da imagem", type: "error" });
          setUploading(false);
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
        // Atualizar produto com as imagens
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
      setUploading(false);
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

  const handleDelete = async (id: string) => {
    if (isLoading) return;
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (response.ok) {
          setToast({ message: "Produto deletado com sucesso!", type: "success" });
          fetchProducts();
        } else {
          setToast({ message: "Erro ao deletar produto", type: "error" });
        }
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
        setToast({ message: "Erro ao deletar produto", type: "error" });
      }
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Header>
        <h1>Gerenciar Produtos</h1>
        <div className="actions">
          <button className="new" onClick={handleNewProduct}>
            + Novo Produto
          </button>
          <button className="back" onClick={() => router.push("/admin/dashboard")}>
            Voltar ao Dashboard
          </button>
        </div>
      </Header>
      <Main>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <Form onSubmit={handleSubmit}>
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
              {uploading && <p>Fazendo upload...</p>}
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

            <textarea
              placeholder="Especificações (JSON)"
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
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

        <ProductList>
          {products.map((product) => (
            <ProductItem key={product._id}>
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
      </Main>
    </Container>
  );
}