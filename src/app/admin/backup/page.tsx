'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useTheme } from '@/contexts/ThemeContext';
import AdminHeader from '@/components/AdminHeader';
import { Database, CheckCircle, XCircle, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { Toast } from '@/components/Toast';
import * as media from '@/styles/media';

const Container = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#1a202c' : '#f5f5f5'};
  transition: background 0.3s ease;
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  ${media.down('md')} {
    padding: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  transition: all 0.3s ease;

  h3 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const StatValue = styled.div<{ $isDark: boolean }>`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#a0aec0' : '#6b7280'};
  font-size: 0.9rem;
`;

const WeeklyStatus = styled.div`
  display: grid;
  gap: 1rem;
`;

const DayStatus = styled.div<{ $isDark: boolean; $status?: 'success' | 'failed' | 'pending' }>`
  background: ${props => props.$isDark ? '#1a202c' : '#f9fafb'};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid ${props => {
    if (props.$status === 'success') return '#10b981';
    if (props.$status === 'failed') return '#dc2626';
    return '#6b7280';
  }};
`;

const DayInfo = styled.div<{ $isDark: boolean }>`
  h4 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    margin-bottom: 0.25rem;
  }

  p {
    color: ${props => props.$isDark ? '#a0aec0' : '#6b7280'};
    font-size: 0.85rem;
  }
`;

const StatusIcon = styled.div<{ $status: 'success' | 'failed' | 'pending' }>`
  color: ${props => {
    if (props.$status === 'success') return '#10b981';
    if (props.$status === 'failed') return '#dc2626';
    return '#6b7280';
  }};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;

  ${props => props.$variant === 'secondary' ? `
    background: #6b7280;
    &:hover { background: #4b5563; }
  ` : `
    background: #3b82f6;
    &:hover { background: #2563eb; }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HistoryTable = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
`;

const TableHeader = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1a202c' : '#f9fafb'};
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};
  display: grid;
  grid-template-columns: 150px 120px 200px 100px 150px 1fr;
  gap: 1rem;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};

  ${media.down('md')} {
    display: none;
  }
`;

const TableRow = styled.div<{ $isDark: boolean }>`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};
  display: grid;
  grid-template-columns: 150px 120px 200px 100px 150px 1fr;
  gap: 1rem;
  align-items: center;
  color: ${props => props.$isDark ? '#cbd5e0' : '#374151'};

  &:last-child {
    border-bottom: none;
  }

  ${media.down('md')} {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const StatusBadge = styled.span<{ $status: 'success' | 'failed' | 'in_progress' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => {
    if (props.$status === 'success') return '#d1fae5';
    if (props.$status === 'failed') return '#fee2e2';
    return '#e0e7ff';
  }};
  color: ${props => {
    if (props.$status === 'success') return '#065f46';
    if (props.$status === 'failed') return '#991b1b';
    return '#3730a3';
  }};
  display: inline-block;
`;

interface BackupStats {
  total: number;
  successful: number;
  failed: number;
  lastBackup: any;
  weeklyStatus: Record<string, any>;
}

interface BackupHistory {
  _id: string;
  executionDate: string;
  weekday: string;
  targetDatabase: string;
  status: 'success' | 'failed' | 'in_progress';
  duration?: number;
  executedBy: string;
}

export default function BackupPage() {
  const router = useRouter();
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [history, setHistory] = useState<BackupHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch('/api/backup/stats', {
          credentials: 'include'
        }),
        fetch('/api/backup/history?limit=20', {
          credentials: 'include'
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData.history);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeBackup = () => {
    router.push('/admin/import');
  };

  const weekdays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

  if (loading) {
    return (
      <Container $isDark={isDark}>
        <AdminHeader title="Gerenciamento de Backup" showBackButton backPath="/admin/system" />
        <Main>
          <p>Carregando...</p>
        </Main>
      </Container>
    );
  }

  return (
    <Container $isDark={isDark}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AdminHeader 
        title="Gerenciamento de Backup" 
        showBackButton 
        backPath="/admin/system"
        customActions={
          <Button onClick={executeBackup}>
            <Database size={20} />
            Importar Dados
          </Button>
        }
      />
      <Main>
        <Grid>
          <Card $isDark={isDark}>
            <h3><Database size={20} /> Total de Backups</h3>
            <StatValue $isDark={isDark}>{stats?.total || 0}</StatValue>
            <StatLabel $isDark={isDark}>Execuções registradas</StatLabel>
          </Card>

          <Card $isDark={isDark}>
            <h3><CheckCircle size={20} /> Bem-sucedidos</h3>
            <StatValue $isDark={isDark}>{stats?.successful || 0}</StatValue>
            <StatLabel $isDark={isDark}>Backups completos</StatLabel>
          </Card>

          <Card $isDark={isDark}>
            <h3><XCircle size={20} /> Falhas</h3>
            <StatValue $isDark={isDark}>{stats?.failed || 0}</StatValue>
            <StatLabel $isDark={isDark}>Execuções com erro</StatLabel>
          </Card>

          <Card $isDark={isDark}>
            <h3><Clock size={20} /> Último Backup</h3>
            <StatValue $isDark={isDark} style={{ fontSize: '1.2rem' }}>
              {stats?.lastBackup ? new Date(stats.lastBackup.executionDate).toLocaleDateString('pt-BR') : 'N/A'}
            </StatValue>
            <StatLabel $isDark={isDark}>
              {stats?.lastBackup ? stats.lastBackup.targetDatabase : 'Nenhum backup registrado'}
            </StatLabel>
          </Card>
        </Grid>

        <Card $isDark={isDark}>
          <h3><Calendar size={20} /> Status Semanal</h3>
          <WeeklyStatus>
            {weekdays.map(day => {
              const dayBackup = stats?.weeklyStatus[day];
              const status = dayBackup ? 'success' : 'pending';
              
              return (
                <DayStatus key={day} $isDark={isDark} $status={status}>
                  <DayInfo $isDark={isDark}>
                    <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                    <p>
                      {dayBackup 
                        ? `Último backup: ${new Date(dayBackup.executionDate).toLocaleDateString('pt-BR')}`
                        : 'Nenhum backup registrado'
                      }
                    </p>
                  </DayInfo>
                  <StatusIcon $status={status}>
                    {status === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                  </StatusIcon>
                </DayStatus>
              );
            })}
          </WeeklyStatus>
        </Card>

        <Card $isDark={isDark} style={{ marginTop: '2rem' }}>
          <h3><Clock size={20} /> Histórico Recente</h3>
          <HistoryTable $isDark={isDark}>
            <TableHeader $isDark={isDark}>
              <div>Data</div>
              <div>Dia</div>
              <div>Banco</div>
              <div>Status</div>
              <div>Duração</div>
              <div>Executado por</div>
            </TableHeader>
            {history.map(item => (
              <TableRow key={item._id} $isDark={isDark}>
                <div>{new Date(item.executionDate).toLocaleString('pt-BR')}</div>
                <div>{item.weekday}</div>
                <div>{item.targetDatabase}</div>
                <div>
                  <StatusBadge $status={item.status}>
                    {item.status === 'success' ? 'Sucesso' : item.status === 'failed' ? 'Falha' : 'Em progresso'}
                  </StatusBadge>
                </div>
                <div>{item.duration ? `${(item.duration / 1000).toFixed(2)}s` : '-'}</div>
                <div>{item.executedBy}</div>
              </TableRow>
            ))}
          </HistoryTable>
        </Card>
      </Main>
    </Container>
  );
}
