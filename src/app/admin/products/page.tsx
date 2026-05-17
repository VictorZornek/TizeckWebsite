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

const OrderBlock = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 108px;
  flex-shrink: 0;
  padding: 0.25rem 0.35rem 0;

  .order-label {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${props => props.$isDark ? '#e2e8f0' : '#374151'};
  }

  select {
    box-sizing: border-box;
    width: 100px;
    min-width: 100px;
    max-width: 110px;
    height: 40px;
    padding: 0 0.65rem;
    border-radius: 0.5rem;
    border: 2px solid ${props => props.$isDark ? '#6366f1' : '#4f46e5'};
    background: ${props => props.$isDark ? '#2d3748' : '#f8fafc'};
    color: ${props => props.$isDark ? '#f7fafc' : '#0f172a'};
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.2;
    cursor: pointer;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, ${props => props.$isDark ? '0.35' : '0.08'}),
      0 0 0 1px rgba(255, 255, 255, ${props => props.$isDark ? '0.04' : '0.6'}) inset;

    &:hover:not(:disabled) {
      border-color: ${props => props.$isDark ? '#818cf8' : '#4338ca'};
      background: ${props => props.$isDark ? '#374151' : '#fff'};
    }

    &:focus {
      outline: none;
      border-color: ${props => props.$isDark ? '#a5b4fc' : '#3730a3'};
      box-shadow:
        0 0 0 3px ${props => props.$isDark ? 'rgba(129, 140, 248, 0.35)' : 'rgba(79, 70, 229, 0.25)'};
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  ${media.down('md')} {
    width: 100%;
    max-width: 120px;
    min-width: min(100%, 120px);

    select {
      width: 100%;
      max-width: none;
      min-width: unset;
    }
  }
`;

const ItemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem 1.25rem;

  ${media.down('md')} {
    width: 100%;
    justify-content: flex-start;
    align-items: stretch;
  }
`;

const CategoryHeaderRow = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h2<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
  font-size: 1.5rem;
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
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
  align-items: flex-start;
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
      margin-bottom: 0.35rem;
    }

    .position-line {
      font-size: 0.9rem;
      color: ${props => props.$isDark ? '#a0aec0' : '#4b5563'};
      margin-bottom: 0.35rem;

      strong {
        color: ${props => props.$isDark ? '#e2e8f0' : '#111827'};
        font-weight: 700;
      }
    }

    p.meta {
      color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
      margin-bottom: 0.25rem;
    }

    p.desc {
      color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
      margin: 0;
    }
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;

    ${media.down('md')} {
      flex: 1;
      min-width: min(100%, 280px);
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
  featured?: boolean;
}

interface Category {
  _id: string;
  name: string;
}

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

function normalizeProductObjectId(raw: unknown): string | null {
  if (raw == null || raw === "") return null;
  if (typeof raw === "string") {
    const t = raw.trim();
    return OBJECT_ID_RE.test(t) ? t : null;
  }
  if (typeof raw === "object" && raw !== null) {
    const o = raw as Record<string, unknown>;
    if (typeof o.$oid === "string") {
      const t = o.$oid.trim();
      return OBJECT_ID_RE.test(t) ? t : null;
    }
    if (typeof (raw as { toString?: () => string }).toString === "function") {
      const t = String((raw as { toString: () => string }).toString()).trim();
      if (OBJECT_ID_RE.test(t)) return t;
    }
  }
  return null;
}

function reorderProductsInCategory(
  list: Product[],
  categoryName: string,
  productId: string,
  newPosition1Based: number
): Product[] | null {
  const idNorm = normalizeProductObjectId(productId);
  if (!idNorm) return null;

  const catIndices: number[] = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].category === categoryName) catIndices.push(i);
  }

  const sub = catIndices.map((i) => list[i]);
  const fromSub = sub.findIndex(
    (p) => normalizeProductObjectId(p._id) === idNorm
  );
  if (fromSub === -1) return null;
  const targetSub = Math.min(
    Math.max(newPosition1Based - 1, 0),
    sub.length - 1
  );
  if (fromSub === targetSub) return null;

  const nextSub = [...sub];
  const [removed] = nextSub.splice(fromSub, 1);
  nextSub.splice(targetSub, 0, removed);

  const next = [...list];
  catIndices.forEach((listIdx, j) => {
    next[listIdx] = nextSub[j];
  });
  return next;
}

function canReorderCategory(
  categoryName: string,
  categoryProducts: Product[],
  allProducts: Product[],
  searchTerm: string
): boolean {
  if (searchTerm.trim() !== "") return false;
  const total = allProducts.filter((p) => p.category === categoryName).length;
  return total > 0 && categoryProducts.length === total;
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
    featured: false,
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
  const [orderDirtyByCategory, setOrderDirtyByCategory] = useState<
    Record<string, boolean>
  >({});
  const [reorderModalCategory, setReorderModalCategory] = useState<
    string | null
  >(null);
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
      if (!Array.isArray(data)) {
        setProducts([]);
        setOrderDirtyByCategory({});
        return;
      }
      const normalized = data
        .map((p: Product & { _id: unknown }) => {
          const id = normalizeProductObjectId(p._id);
          if (!id) return null;
          return { ...p, _id: id };
        })
        .filter((p): p is Product => p !== null);
      setProducts(normalized);
      setOrderDirtyByCategory({});
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleProductOrderSelect = (
    categoryName: string,
    productId: string,
    newPosition: number
  ) => {
    setProducts((prev) => {
      const next = reorderProductsInCategory(
        prev,
        categoryName,
        productId,
        newPosition
      );
      if (next) {
        queueMicrotask(() =>
          setOrderDirtyByCategory((d) => ({ ...d, [categoryName]: true }))
        );
        return next;
      }
      return prev;
    });
  };

  const requestSaveProductOrder = (categoryName: string) => {
    if (
      !orderDirtyByCategory[categoryName] ||
      isLoading
    ) {
      return;
    }
    setReorderModalCategory(categoryName);
  };

  const handleConfirmProductReorder = async () => {
    const categoryName = reorderModalCategory;
    setReorderModalCategory(null);
    if (!categoryName || isLoading) return;

    const orderedIds = products
      .filter((p) => p.category === categoryName)
      .map((p) => normalizeProductObjectId(p._id))
      .filter((id): id is string => id !== null);

    const expectedCount = products.filter(
      (p) => p.category === categoryName
    ).length;

    if (orderedIds.length !== expectedCount) {
      setToast({
        message:
          "Não foi possível montar a lista de produtos. Recarregue a página.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/products/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ category: categoryName, orderedIds }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setToast({
          message: "Ordem dos produtos salva com sucesso!",
          type: "success",
        });
        setOrderDirtyByCategory((prev) => {
          const next = { ...prev };
          delete next[categoryName];
          return next;
        });
      } else {
        setToast({
          message:
            typeof data.error === "string"
              ? data.error
              : "Erro ao salvar ordem dos produtos",
          type: "error",
        });
      }
      await fetchProducts();
    } catch (error) {
      console.error("Erro ao salvar ordem:", error);
      setToast({
        message: "Erro ao salvar ordem dos produtos",
        type: "error",
      });
    } finally {
      setIsLoading(false);
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
            featured: formData.featured,
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
        uploadFormData.append("uploadType", "product");

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
            featured: formData.featured,
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
            featured: formData.featured,
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
      featured: product.featured || false,
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
      featured: false,
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
      featured: false,
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
        title="Deletar Produto"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        message="Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita."
      />
      <ConfirmModal
        isOpen={reorderModalCategory !== null}
        title="Confirmar nova ordem"
        message="Deseja salvar a nova ordem dos produtos desta categoria? Essa alteração será refletida na página pública."
        onConfirm={handleConfirmProductReorder}
        onCancel={() => setReorderModalCategory(null)}
        confirmLabel="Confirmar e salvar"
        cancelLabel="Cancelar"
        variant="primary"
        showIcon={false}
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
          Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => {
            const canReorder = canReorderCategory(
              categoryName,
              categoryProducts,
              products,
              searchTerm
            );
            return (
            <CategorySection key={categoryName}>
              <CategoryHeaderRow $isDark={isDark}>
                <CategoryTitle $isDark={isDark}>
                  {categoryName}
                  <ProductCount $isDark={isDark}>
                    ({categoryProducts.length})
                  </ProductCount>
                </CategoryTitle>
                <ActionButton
                  $variant="secondary"
                  type="button"
                  onClick={() => requestSaveProductOrder(categoryName)}
                  disabled={
                    !orderDirtyByCategory[categoryName] ||
                    isLoading ||
                    !canReorder ||
                    categoryProducts.length === 0
                  }
                >
                  Salvar ordem
                </ActionButton>
              </CategoryHeaderRow>
              <ProductList $isDark={isDark}>
                {categoryProducts.map((product, indexInCategory) => (
                  <ProductItem key={product._id} $isDark={isDark}>
                    <div className="info">
                      <h3>
                        {product.name}
                        {product.featured && (
                          <span style={{ 
                            marginLeft: '0.5rem', 
                            fontSize: '0.8rem', 
                            background: '#f59e0b', 
                            color: 'white', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '0.3rem',
                            fontWeight: 'bold'
                          }}>
                            ⭐ DESTAQUE
                          </span>
                        )}
                      </h3>
                      <p className="position-line">
                        Ordem: <strong>{indexInCategory + 1}º</strong> nesta categoria
                      </p>
                      <p className="meta"><strong>Categoria:</strong> {product.category}</p>
                      <p className="desc">{product.description}</p>
                    </div>
                    <ItemMeta>
                      <OrderBlock $isDark={isDark}>
                        <span className="order-label">Posição</span>
                        <select
                          value={indexInCategory + 1}
                          disabled={
                            isLoading ||
                            !canReorder ||
                            categoryProducts.length === 0
                          }
                          onChange={(e) =>
                            handleProductOrderSelect(
                              categoryName,
                              product._id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          aria-label={`Posição do produto ${product.name} na categoria ${categoryName}`}
                        >
                          {Array.from(
                            { length: categoryProducts.length },
                            (_, i) => i + 1
                          ).map((pos) => (
                            <option key={pos} value={pos}>
                              {pos}º
                            </option>
                          ))}
                        </select>
                      </OrderBlock>
                      <div className="actions">
                        <button className="edit" onClick={() => handleEdit(product)} disabled={isLoading}>
                          Editar
                        </button>
                        <button className="delete" onClick={() => handleDelete(product._id)} disabled={isLoading}>
                          {isLoading ? 'Processando...' : 'Deletar'}
                        </button>
                      </div>
                    </ItemMeta>
                  </ProductItem>
                ))}
              </ProductList>
            </CategorySection>
            );
          })
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

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
              />
              <span style={{ color: isDark ? '#f7fafc' : '#101a33' }}>Produto em Destaque</span>
            </label>
            
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
