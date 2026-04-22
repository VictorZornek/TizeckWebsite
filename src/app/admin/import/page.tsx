'use client'

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";

const Container = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#1a202c' : '#f5f5f5'};
  transition: background 0.3s ease;
`;



const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const UploadSection = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  h2 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 1rem;
  }

  .upload-area {
    border: 2px dashed ${props => props.$isDark ? '#4a5568' : '#ddd'};
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
      color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
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
    color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
    margin-top: 1rem;
    font-weight: 500;
  }
`;

const LogsSection = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  h3 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
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

const ResultSection = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  h3 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 1rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;

    .stat-card {
      padding: 1rem;
      border-radius: 0.5rem;
      background: ${props => props.$isDark ? '#1a202c' : '#f9fafb'};

      h4 {
        color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .numbers {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;

        span {
          font-size: 1.5rem;
          font-weight: bold;

          &.success {
            color: #10b981;
          }

          &.info {
            color: #3b82f6;
          }

          &.error {
            color: #dc2626;
          }
        }
      }

      small {
        color: #666;
        font-size: 0.75rem;
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

const HistorySection = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  transition: all 0.3s ease;

  h3 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 1rem;
  }

  .history-item {
    padding: 1rem;
    border-bottom: 1px solid ${props => props.$isDark ? '#4a5568' : '#eee'};

    &:last-child {
      border-bottom: none;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;

      .filename {
        font-weight: 500;
        color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
      }

      .date {
        color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
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
      color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
    }
  }
`;

interface ImportResult {
  status: string;
  stats: {
    customers: { imported: number; errors: number; new: number; updated: number };
    products: { imported: number; errors: number; new: number; updated: number };
    orders: { imported: number; errors: number; new: number; updated: number };
    paymentConditions: { imported: number; errors: number; new: number; updated: number };
    accounts: { imported: number; errors: number; new: number; updated: number };
    stockEntries: { imported: number; errors: number; new: number; updated: number };
    jobFunctions: { imported: number; errors: number; new: number; updated: number };
    employees: { imported: number; errors: number; new: number; updated: number };
    regions: { imported: number; errors: number; new: number; updated: number };
    conditionItems: { imported: number; errors: number; new: number; updated: number };
    orderInstallments: { imported: number; errors: number; new: number; updated: number };
    companySettings: { imported: number; errors: number; new: number; updated: number };
    customerItems: { imported: number; errors: number; new: number; updated: number };
    systemUsers: { imported: number; errors: number; new: number; updated: number };
  };
  errors: string[];
  logs: string[];
  processingTime: number;
}

interface HistoryItem {
  _id: string;
  fileName: string;
  importDate: string;
  status: string;
  stats: {
    customers: { imported: number; errors: number; new: number; updated: number };
    products: { imported: number; errors: number; new: number; updated: number };
    orders: { imported: number; errors: number; new: number; updated: number };
    paymentConditions: { imported: number; errors: number; new: number; updated: number };
    accounts: { imported: number; errors: number; new: number; updated: number };
    stockEntries: { imported: number; errors: number; new: number; updated: number };
    jobFunctions: { imported: number; errors: number; new: number; updated: number };
    employees: { imported: number; errors: number; new: number; updated: number };
    regions: { imported: number; errors: number; new: number; updated: number };
    conditionItems: { imported: number; errors: number; new: number; updated: number };
    orderInstallments: { imported: number; errors: number; new: number; updated: number };
    companySettings: { imported: number; errors: number; new: number; updated: number };
    customerItems: { imported: number; errors: number; new: number; updated: number };
    systemUsers: { imported: number; errors: number; new: number; updated: number };
  };
  processingTime: number;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState("");
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <Container $isDark={isDark}>
      <AdminHeader title="Importação de Banco Legado" showBackButton />
      <Main>
        <UploadSection $isDark={isDark}>
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
          <LogsSection $isDark={isDark}>
            <h3>Logs da Importação</h3>
            <div className="logs-container">
              {logs.map((log, index) => (
                <div key={index} className="log-line">{log}</div>
              ))}
            </div>
          </LogsSection>
        )}

        {result && (
          <ResultSection $isDark={isDark}>
            <h3>Resultado da Importação com Backup Rotativo</h3>
            <div style={{ marginBottom: '1rem', padding: '1rem', background: isDark ? '#1a202c' : '#f0f9ff', borderRadius: '0.5rem' }}>
              <p style={{ color: isDark ? '#f7fafc' : '#101a33', marginBottom: '0.5rem' }}>
                <strong>Banco de Destino:</strong> {result.targetDatabase || 'N/A'}
              </p>
              <p style={{ color: isDark ? '#f7fafc' : '#101a33', marginBottom: '0.5rem' }}>
                <strong>Dia da Semana:</strong> {result.weekday || 'N/A'}
              </p>
              <p style={{ color: isDark ? '#f7fafc' : '#101a33' }}>
                <strong>Status:</strong> <span style={{ color: result.status === 'success' ? '#10b981' : '#dc2626' }}>
                  {result.status === 'success' ? 'Sucesso' : 'Erro'}
                </span>
              </p>
            </div>
            {result.stats && (
              <div className="stats">
              <div className="stat-card">
                <h4>Clientes</h4>
                <div className="numbers">
                  <span className="success" title="Novos">{result.stats.customers.new}</span>
                  <span className="info" title="Atualizados">{result.stats.customers.updated}</span>
                  <span className="error" title="Erros">{result.stats.customers.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Produtos</h4>
                <div className="numbers">
                  <span className="success">{result.stats.products.new}</span>
                  <span className="info">{result.stats.products.updated}</span>
                  <span className="error">{result.stats.products.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Pedidos</h4>
                <div className="numbers">
                  <span className="success">{result.stats.orders.new}</span>
                  <span className="info">{result.stats.orders.updated}</span>
                  <span className="error">{result.stats.orders.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Condições Pagto</h4>
                <div className="numbers">
                  <span className="success">{result.stats.paymentConditions.new}</span>
                  <span className="info">{result.stats.paymentConditions.updated}</span>
                  <span className="error">{result.stats.paymentConditions.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Contas</h4>
                <div className="numbers">
                  <span className="success">{result.stats.accounts.new}</span>
                  <span className="info">{result.stats.accounts.updated}</span>
                  <span className="error">{result.stats.accounts.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Entradas Estoque</h4>
                <div className="numbers">
                  <span className="success">{result.stats.stockEntries.new}</span>
                  <span className="info">{result.stats.stockEntries.updated}</span>
                  <span className="error">{result.stats.stockEntries.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Funções</h4>
                <div className="numbers">
                  <span className="success">{result.stats.jobFunctions.new}</span>
                  <span className="info">{result.stats.jobFunctions.updated}</span>
                  <span className="error">{result.stats.jobFunctions.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Funcionários</h4>
                <div className="numbers">
                  <span className="success">{result.stats.employees.new}</span>
                  <span className="info">{result.stats.employees.updated}</span>
                  <span className="error">{result.stats.employees.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Regiões</h4>
                <div className="numbers">
                  <span className="success">{result.stats.regions.new}</span>
                  <span className="info">{result.stats.regions.updated}</span>
                  <span className="error">{result.stats.regions.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Itens Condição</h4>
                <div className="numbers">
                  <span className="success">{result.stats.conditionItems.new}</span>
                  <span className="info">{result.stats.conditionItems.updated}</span>
                  <span className="error">{result.stats.conditionItems.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Parcelas Pedido</h4>
                <div className="numbers">
                  <span className="success">{result.stats.orderInstallments.new}</span>
                  <span className="info">{result.stats.orderInstallments.updated}</span>
                  <span className="error">{result.stats.orderInstallments.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Config Empresa</h4>
                <div className="numbers">
                  <span className="success">{result.stats.companySettings.new}</span>
                  <span className="info">{result.stats.companySettings.updated}</span>
                  <span className="error">{result.stats.companySettings.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Histórico Cliente</h4>
                <div className="numbers">
                  <span className="success">{result.stats.customerItems.new}</span>
                  <span className="info">{result.stats.customerItems.updated}</span>
                  <span className="error">{result.stats.customerItems.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
              <div className="stat-card">
                <h4>Usuários Sistema</h4>
                <div className="numbers">
                  <span className="success">{result.stats.systemUsers.new}</span>
                  <span className="info">{result.stats.systemUsers.updated}</span>
                  <span className="error">{result.stats.systemUsers.errors}</span>
                </div>
                <small>Novos / Atualizados / Erros</small>
              </div>
            </div>
            )}
            {result.errors && result.errors.length > 0 && (
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

        <HistorySection $isDark={isDark}>
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
                Clientes: {item.stats.customers.new}N/{item.stats.customers.updated}A | 
                Produtos: {item.stats.products.new}N/{item.stats.products.updated}A | 
                Pedidos: {item.stats.orders.new}N/{item.stats.orders.updated}A | 
                Condições: {item.stats.paymentConditions?.new || 0}N/{item.stats.paymentConditions?.updated || 0}A | 
                Contas: {item.stats.accounts?.new || 0}N/{item.stats.accounts?.updated || 0}A | 
                Estoque: {item.stats.stockEntries?.new || 0}N/{item.stats.stockEntries?.updated || 0}A | 
                Funções: {item.stats.jobFunctions?.new || 0}N/{item.stats.jobFunctions?.updated || 0}A | 
                Funcionários: {item.stats.employees?.new || 0}N/{item.stats.employees?.updated || 0}A | 
                Regiões: {item.stats.regions?.new || 0}N/{item.stats.regions?.updated || 0}A | 
                Itens Cond: {item.stats.conditionItems?.new || 0}N/{item.stats.conditionItems?.updated || 0}A | 
                Parcelas: {item.stats.orderInstallments?.new || 0}N/{item.stats.orderInstallments?.updated || 0}A | 
                Config: {item.stats.companySettings?.new || 0}N/{item.stats.companySettings?.updated || 0}A | 
                Hist Cliente: {item.stats.customerItems?.new || 0}N/{item.stats.customerItems?.updated || 0}A | 
                Usuários: {item.stats.systemUsers?.new || 0}N/{item.stats.systemUsers?.updated || 0}A
                {item.processingTime && ` | ${item.processingTime}s`}
              </div>
            </div>
          ))}
        </HistorySection>
      </Main>
    </Container>
  );
}
