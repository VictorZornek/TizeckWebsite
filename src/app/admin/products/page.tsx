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

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 0.5rem;
      }
    }
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

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  specifications: Record<string, any>;
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        console.error("Erro no upload:", error);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const specifications = formData.specifications 
        ? JSON.parse(formData.specifications) 
        : {};

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          specifications,
        }),
      });

      if (response.ok) {
        setFormData({
          name: "",
          description: "",
          category: "",
          images: [],
          specifications: "",
        });
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
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
    setEditingId(product._id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        fetchProducts();
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <h1>Gerenciar Produtos</h1>
        <button onClick={() => router.push("/admin/dashboard")}>
          Voltar ao Dashboard
        </button>
      </Header>
      <Main>
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
              disabled={uploading}
            />
            {uploading && <p>Fazendo upload...</p>}
            <div className="image-preview">
              {formData.images.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index}`} />
              ))}
            </div>
          </div>

          <textarea
            placeholder="Especificações (JSON)"
            value={formData.specifications}
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          />
          
          <button type="submit">
            {editingId ? "Atualizar" : "Criar"} Produto
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  description: "",
                  category: "",
                  images: [],
                  specifications: "",
                });
              }}
              style={{ marginLeft: "1rem", background: "#6b7280" }}
            >
              Cancelar
            </button>
          )}
        </Form>

        <ProductList>
          {products.map((product) => (
            <ProductItem key={product._id}>
              <div className="info">
                <h3>{product.name}</h3>
                <p><strong>Categoria:</strong> {product.category}</p>
                <p>{product.description}</p>
              </div>
              <div className="actions">
                <button className="edit" onClick={() => handleEdit(product)}>
                  Editar
                </button>
                <button className="delete" onClick={() => handleDelete(product._id)}>
                  Deletar
                </button>
              </div>
            </ProductItem>
          ))}
        </ProductList>
      </Main>
    </Container>
  );
}