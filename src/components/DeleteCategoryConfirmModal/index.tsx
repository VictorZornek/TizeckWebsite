import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "@/contexts/ThemeContext";

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease;

  .icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  h2 {
    color: #dc2626;
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .message {
    color: ${props => props.$isDark ? '#e5e7eb' : '#374151'};
    line-height: 1.6;
    margin-bottom: 1.5rem;

    strong {
      color: ${props => props.$isDark ? '#fbbf24' : '#dc2626'};
    }

    ul {
      margin: 1rem 0;
      padding-left: 1.5rem;

      li {
        margin: 0.5rem 0;
        color: #dc2626;
        font-weight: 500;
      }
    }

    .warning {
      background: ${props => props.$isDark ? '#7f1d1d' : '#fef2f2'};
      border-left: 4px solid #dc2626;
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      color: ${props => props.$isDark ? '#fecaca' : '#991b1b'};
    }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: ${props => props.$isDark ? '#f7fafc' : '#374151'};
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid ${props => props.$isDark ? '#4a5568' : '#d1d5db'};
      border-radius: 0.5rem;
      font-size: 1rem;
      background: ${props => props.$isDark ? '#1a202c' : 'white'};
      color: ${props => props.$isDark ? '#f7fafc' : '#374151'};
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #dc2626;
      }

      &.valid {
        border-color: #10b981;
      }

      &.invalid {
        border-color: #dc2626;
      }
    }

    .hint {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: ${props => props.$isDark ? '#cbd5e0' : '#6b7280'};
    }

    .validation-status {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;

      &.valid {
        color: #10b981;
      }

      &.invalid {
        color: #dc2626;
      }
    }
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.cancel {
        background: ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};
        color: ${props => props.$isDark ? '#f7fafc' : '#374151'};

        &:hover:not(:disabled) {
          background: ${props => props.$isDark ? '#718096' : '#d1d5db'};
        }
      }

      &.confirm {
        background: #dc2626;
        color: white;

        &:hover:not(:disabled) {
          background: #b91c1c;
        }

        &.loading {
          position: relative;
          padding-right: 2.5rem;

          &::after {
            content: '';
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.6s linear infinite;
          }
        }
      }
    }
  }

  @keyframes spin {
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;

interface DeleteCategoryConfirmModalProps {
  isOpen: boolean;
  categoryName: string;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: (password: string, confirmationPhrase: string) => void;
}

export function DeleteCategoryConfirmModal({
  isOpen,
  categoryName,
  isLoading,
  onCancel,
  onConfirm,
}: DeleteCategoryConfirmModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [password, setPassword] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");

  const REQUIRED_PHRASE = "EXCLUIR CATEGORIA";
  const isPhraseValid = confirmationPhrase === REQUIRED_PHRASE;
  const isFormValid = password.length > 0 && isPhraseValid;

  // Limpar campos ao fechar modal
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setConfirmationPhrase("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (isFormValid && !isLoading) {
      onConfirm(password, confirmationPhrase);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !isLoading) {
      handleConfirm();
    }
  };

  return (
    <Overlay $isOpen={isOpen} onClick={onCancel}>
      <Content $isDark={isDark} onClick={(e) => e.stopPropagation()}>
        <div className="icon">⚠️</div>
        <h2>ATENÇÃO: Ação Irreversível</h2>
        
        <div className="message">
          <p>
            Você está prestes a deletar a categoria <strong>{categoryName}</strong>.
          </p>
          <ul>
            <li>Remover TODOS os produtos desta categoria</li>
            <li>Deletar TODAS as imagens associadas do S3</li>
            <li>Esta ação é IRREVERSÍVEL</li>
          </ul>
          <div className="warning">Para confirmar, digite sua senha e a frase de confirmação abaixo:</div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Sua senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua senha"
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmationPhrase">Frase de confirmação:</label>
          <input
            id="confirmationPhrase"
            type="text"
            value={confirmationPhrase}
            onChange={(e) => setConfirmationPhrase(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite: EXCLUIR CATEGORIA"
            disabled={isLoading}
            className={confirmationPhrase.length > 0 ? (isPhraseValid ? 'valid' : 'invalid') : ''}
            autoComplete="off"
          />
          <div className="hint">Digite exatamente: <strong>EXCLUIR CATEGORIA</strong></div>
          {confirmationPhrase.length > 0 && (
            <div className={`validation-status ${isPhraseValid ? 'valid' : 'invalid'}`}>
              {isPhraseValid ? '✓ Frase correta' : '✗ Frase incorreta'}
            </div>
          )}
        </div>

        <div className="actions">
          <button 
            className="cancel" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            className={`confirm ${isLoading ? 'loading' : ''}`}
            onClick={handleConfirm}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Deletando...' : 'Sim, deletar'}
          </button>
        </div>
      </Content>
    </Overlay>
  );
}
