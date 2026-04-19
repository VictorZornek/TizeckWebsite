'use client'

import { useRouter } from "next/navigation";
import styled from "styled-components";
import * as media from "@/styles/media";
import { useTheme } from "@/contexts/ThemeContext";

const HeaderContainer = styled.header<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  transition: background 0.3s ease;

  ${media.down('md')} {
    padding: 1rem;
  }

  h1 {
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    font-size: 1.5rem;
    transition: color 0.3s ease;

    ${media.down('md')} {
      font-size: 1.25rem;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ThemeToggle = styled.button<{ $isDark: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.$isDark ? '#4a5568' : '#e2e8f0'};
  color: ${props => props.$isDark ? '#f7fafc' : '#2d3748'};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  ${media.down('md')} {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  &:hover {
    background: ${props => props.$isDark ? '#718096' : '#cbd5e0'};
  }
`;

const ActionButton = styled.button<{ $isDark?: boolean; $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;

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
        background: ${props.$isDark ? '#4a5568' : '#6b7280'};
        &:hover { background: ${props.$isDark ? '#718096' : '#4b5563'}; }
      `;
    }
    return `
      background: #3b82f6;
      &:hover { background: #2563eb; }
    `;
  }}
`;

interface AdminHeaderProps {
  title: string;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
  backPath?: string;
}

export default function AdminHeader({ 
  title, 
  showBackButton = false, 
  showLogoutButton = false,
  backPath = "/admin/dashboard"
}: AdminHeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <HeaderContainer $isDark={isDark}>
      <h1>{title}</h1>
      <HeaderActions>
        <ThemeToggle $isDark={isDark} onClick={toggleTheme}>
          {isDark ? '☀️' : '🌙'}
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </ThemeToggle>
        {showBackButton && (
          <ActionButton $isDark={isDark} $variant="secondary" onClick={() => router.push(backPath)}>
            Voltar
          </ActionButton>
        )}
        {showLogoutButton && (
          <ActionButton $variant="danger" onClick={handleLogout}>
            Sair
          </ActionButton>
        )}
      </HeaderActions>
    </HeaderContainer>
  );
}
