'use client'

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { Toast } from "@/components/Toast";

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

  .explicativo {
    color: ${props => props.$isDark ? '#cbd5e0' : '#555'};
    font-size: 1rem;
    line-height: 1.55;
    margin-bottom: 0;
    max-width: 52rem;
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

  button.refresh-historico {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background: #3b82f6;
    color: white;
    width: auto;
    font-weight: 500;

    &:hover:not(:disabled) {
      background: #2563eb;
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    &.loading::after {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-left: 8px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin-history-btn 0.6s linear infinite;
      vertical-align: middle;
    }
  }

  @keyframes spin-history-btn {
    to { transform: rotate(360deg); }
  }

  .history-header-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;

    h3 {
      margin-bottom: 0;
    }
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

      &.in_progress {
        background: #e0e7ff;
        color: #3730a3;
      }
    }

    .summary {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: ${props => props.$isDark ? '#cbd5e0' : '#666'};
    }
  }
`;

interface HistoryItem {
  _id: string;
  fileName: string;
  importDate: string;
  status: string;
  targetDatabase?: string;
  weekday?: string;
  collectionsCount?: number;
  documentsCount?: number;
  backupType?: string;
  processingTime?: number;
}

export default function ImportPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    void fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/import/history");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Falha ao carregar histórico");
      }
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      setToast({
        message: "Não foi possível carregar o histórico de importações.",
        type: "error",
      });
    }
  };

  const handleRefreshHistory = async () => {
    setRefreshing(true);
    try {
      await fetchHistory();
    } finally {
      setRefreshing(false);
    }
  };

  const statusLabel = (status: string) => {
    if (status === "success") return "Sucesso";
    if (status === "error" || status === "failed") return "Erro";
    if (status === "partial") return "Parcial";
    if (status === "in_progress") return "Em andamento";
    return status;
  };

  return (
    <Container $isDark={isDark}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AdminHeader title="Importação de Banco Legado" showBackButton />
      <Main>
        <UploadSection $isDark={isDark}>
          <h2>Backup automático</h2>
          <p className="explicativo">
            O backup é enviado pelo atalho instalado no computador da empresa. Após o envio,
            o resultado aparecerá automaticamente no histórico abaixo.
          </p>
        </UploadSection>

        <HistorySection $isDark={isDark}>
          <div className="history-header-row">
            <h3>Histórico de importações</h3>
            <button
              type="button"
              onClick={handleRefreshHistory}
              disabled={refreshing}
              className={`refresh-historico${refreshing ? " loading" : ""}`}
            >
              {refreshing ? "Atualizando..." : "Atualizar histórico"}
            </button>
          </div>
          {history.map((item) => (
            <div key={item._id} className="history-item">
              <div className="header">
                <span className="filename">{item.fileName}</span>
                <span className="date">
                  {new Date(item.importDate).toLocaleString("pt-BR")}
                </span>
              </div>
              <span
                className={`status ${item.status === 'failed' ? 'error' : item.status}`}
              >
                {statusLabel(item.status)}
              </span>
              <div className="summary">
                {item.collectionsCount !== undefined && item.documentsCount !== undefined ? (
                  <>
                    <strong>Banco:</strong> {item.targetDatabase} |
                    <strong> Dia:</strong> {item.weekday} |
                    <strong> Collections:</strong> {item.collectionsCount} |
                    <strong> Documentos:</strong> {item.documentsCount.toLocaleString('pt-BR')}
                    {item.backupType === 'monthly' && ' | Backup mensal'}
                    {item.processingTime ? ` | ${item.processingTime}s` : ''}
                  </>
                ) : (
                  'Sem dados de validação'
                )}
              </div>
            </div>
          ))}
        </HistorySection>
      </Main>
    </Container>
  );
}
