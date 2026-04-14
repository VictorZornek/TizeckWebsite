'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
`;

const UploadBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    color: #101a33;
  }

  .file-input-wrapper {
    position: relative;
    margin-bottom: 1rem;

    input[type="file"] {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .file-input-label {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      background: #f9fafb;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #3b81f5;
        background: #eff6ff;
      }

      &.has-file {
        border-color: #10b981;
        background: #ecfdf5;
        border-style: solid;
      }

      .icon {
        font-size: 2rem;
        color: #6b7280;
      }

      &.has-file .icon {
        color: #10b981;
      }

      .text {
        flex: 1;

        .main {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .sub {
          font-size: 0.875rem;
          color: #6b7280;
        }

        &.has-file .main {
          color: #10b981;
        }
      }
    }
  }

  button {
    padding: 0.75rem 1.5rem;
    background: #3b81f5;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
      background: #2563eb;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .info {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
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

    &.download {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    &.delete {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }
  }
`;

interface ClientFile {
  _id: string;
  fileName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  createdAt: string;
}

export default function ClientFilesPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const res = await fetch(`/api/clients/${clientId}/files`);
    const data = await res.json();
    setFiles(data);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await fetch(`/api/clients/${clientId}/files`, {
        method: "POST",
        body: formData,
      });
      setSelectedFile(null);
      loadFiles();
    } catch (error) {
      alert("Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (confirm("Tem certeza que deseja deletar este arquivo?")) {
      await fetch(`/api/files/${fileId}`, { method: "DELETE" });
      loadFiles();
    }
  };

  const handleDownload = (s3Key: string, fileName: string) => {
    const s3Base = process.env.NEXT_PUBLIC_S3_BASE || "https://tizeck-clients.s3.sa-east-1.amazonaws.com";
    const url = `${s3Base}/${s3Key}`;
    window.open(url, "_blank");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <Container>
      <Header>
        <h1>Arquivos do Cliente</h1>
        <button onClick={() => router.push("/admin/clientes")}>Voltar</button>
      </Header>
      <Main>
        <TopBar>
          <h2>Gerenciar Arquivos</h2>
        </TopBar>

        <UploadBox>
          <h3>Upload de Arquivo</h3>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="file-upload" className={`file-input-label ${selectedFile ? 'has-file' : ''}`}>
              <div className="icon">
                {selectedFile ? '📄' : '📁'}
              </div>
              <div className={`text ${selectedFile ? 'has-file' : ''}`}>
                <div className="main">
                  {selectedFile ? selectedFile.name : 'Clique para selecionar um arquivo'}
                </div>
                <div className="sub">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : 'PDF, DOC, DOCX, JPG, PNG (máx. 10MB)'}
                </div>
              </div>
            </label>
          </div>
          <button onClick={handleUpload} disabled={!selectedFile || uploading}>
            {uploading ? "Enviando..." : "Enviar Arquivo"}
          </button>
          <div className="info">
            Tipos permitidos: PDF, DOC, DOCX, JPG, PNG | Tamanho máximo: 10MB
          </div>
        </UploadBox>

        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Tamanho</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id}>
                <td>{file.fileName}</td>
                <td>{file.mimeType}</td>
                <td>{formatFileSize(file.size)}</td>
                <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="download" onClick={() => handleDownload(file.s3Key, file.fileName)}>
                    Download
                  </button>
                  <button className="delete" onClick={() => handleDelete(file._id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Main>
    </Container>
  );
}
