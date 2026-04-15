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
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background: #6b7280;
    color: white;

    &:hover {
      background: #4b5563;
    }
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const UploadSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h2 {
    color: #101a33;
    margin-bottom: 1rem;
  }

  .upload-area {
    border: 2px dashed #ddd;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    margin-bottom: 1rem;

    input[type="file"] {
      display: none;
    }

    label {
      cursor: pointer;
      color: #3b82f6;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }

    p {
      margin-top: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }
  }

  button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background: #10b981;
    color: white;
    width: 100%;
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

  .progress {
    text-align: center;
    color: #666;
    margin-top: 1rem;
    font-weight: 500;
  }
`;

const LogsSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h3 {
    color: #101a33;
    margin-bottom: 1rem;
  }

  .logs-container {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 1rem;
    border-radius: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.5;

    .log-line {
      margin-bottom: 0.25rem;
      white-space: pre-wrap;
      word-break: break-all;

      &:hover {
        background: #2d2d2d;
      }
    }
  }
`;

const ResultSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  h3 {
    color: #101a33;
    margin-bottom: 1rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;

    .stat-card {
      padding: 1rem;
      border-radius: 0.5rem;
      background: #f9fafb;

      h4 {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .numbers {
        display: flex;
        justify-content: space-between;

        span {
          font-size: 1.5rem;
          font-weight: bold;

          &.success {
            color: #10b981;
          }

          &.error {
            color: #dc2626;
          }
        }
      }
    }
  }

  .errors {
    margin-top: 1rem;
    padding: 1rem;
    background: #fef2f2;
    border-radius: 0.5rem;
    max-height: 300px;
    overflow-y: auto;

    h4 {
      color: #dc2626;
      margin-bottom: 0.5rem;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        color: #991b1b;
        font-size: 0.9rem;
        padding: 0.25rem 0;
      }
    }
  }
`;

const HistorySection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h3 {
    color: #101a33;
    margin-bottom: 1rem;
  }

  .history-item {
    padding: 1rem;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;

      .filename {
        font-weight: 500;
        color: #101a33;
      }

      .date {
        color: #666;
        font-size: 0.9rem;
      }
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.85rem;
      font-weight: 500;

      &.success {
        background: #d1fae5;
        color: #065f46;
      }

      &.error {
        background: #fee2e2;
        color: #991b1b;
      }

      &.partial {
        background: #fef3c7;
        color: #92400e;
      }
    }

    .summary {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }
  }
`;

interface ImportResult {
  status: string;
  stats: {
    customers: { imported: number; errors: number };
    products: { imported: number; errors: number };
    orders: { imported: number; errors: number };
  };
  errors: string[];
  logs: string[];
}

interface HistoryItem {
  _id: string;
  fileName: string;
  importDate: string;
  status: string;
  stats: {
    customers: { imported: number; errors: number };
    products: { imported: number; errors: number };
    orders: { imported: number; errors: number };
  };
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/import/history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);
    setLogs([]);
    setProgress("Enviando arquivo...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProgress("Processando importação...");
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      if (data.logs) {
        setLogs(data.logs);
      }
      setProgress("");
      fetchHistory();
    } catch (error) {
      console.error("Erro na importação:", error);
      setProgress("");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Importação de Banco Legado</h1>
        <button onClick={() => router.push("/admin/dashboard")}>
          Voltar ao Dashboard
        </button>
      </Header>
      <Main>
        <UploadSection>
          <h2>Upload do Arquivo .GDB</h2>
          <div className="upload-area">
            <input
              type="file"
              id="file-upload"
              accept=".GDB"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              {file ? file.name : "Clique para selecionar o arquivo .GDB"}
            </label>
            <p>Apenas arquivos .GDB do Firebird são aceitos</p>
          </div>
          <button onClick={handleImport} disabled={!file || importing} className={importing ? 'loading' : ''}>
            {importing ? "Importando..." : "Iniciar Importação"}
          </button>
          {progress && <div className="progress">{progress}</div>}
        </UploadSection>

        {logs.length > 0 && (
          <LogsSection>
            <h3>Logs da Importação</h3>
            <div className="logs-container">
              {logs.map((log, index) => (
                <div key={index} className="log-line">{log}</div>
              ))}
            </div>
          </LogsSection>
        )}

        {result && (
          <ResultSection>
            <h3>Resultado da Importação</h3>
            <div className="stats">
              <div className="stat-card">
                <h4>Clientes</h4>
                <div className="numbers">
                  <span className="success">{result.stats.customers.imported}</span>
                  <span className="error">{result.stats.customers.errors}</span>
                </div>
              </div>
              <div className="stat-card">
                <h4>Produtos</h4>
                <div className="numbers">
                  <span className="success">{result.stats.products.imported}</span>
                  <span className="error">{result.stats.products.errors}</span>
                </div>
              </div>
              <div className="stat-card">
                <h4>Pedidos</h4>
                <div className="numbers">
                  <span className="success">{result.stats.orders.imported}</span>
                  <span className="error">{result.stats.orders.errors}</span>
                </div>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="errors">
                <h4>Erros Encontrados ({result.errors.length})</h4>
                <ul>
                  {result.errors.slice(0, 10).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {result.errors.length > 10 && (
                    <li>... e mais {result.errors.length - 10} erros</li>
                  )}
                </ul>
              </div>
            )}
          </ResultSection>
        )}

        <HistorySection>
          <h3>Histórico de Importações</h3>
          {history.map((item) => (
            <div key={item._id} className="history-item">
              <div className="header">
                <span className="filename">{item.fileName}</span>
                <span className="date">
                  {new Date(item.importDate).toLocaleString("pt-BR")}
                </span>
              </div>
              <span className={`status ${item.status}`}>
                {item.status === "success" ? "Sucesso" : item.status === "error" ? "Erro" : "Parcial"}
              </span>
              <div className="summary">
                Clientes: {item.stats.customers.imported} | 
                Produtos: {item.stats.products.imported} | 
                Pedidos: {item.stats.orders.imported}
              </div>
            </div>
          ))}
        </HistorySection>
      </Main>
    </Container>
  );
}
