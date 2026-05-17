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

const Content = styled.div<{ $isDark: boolean; $variant: "danger" | "primary" }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease;

  .icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  h2 {
    color: ${props =>
      props.$variant === "primary"
        ? props.$isDark
          ? "#6ee7b7"
          : "#047857"
        : "#dc2626"};
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .message {
    color: ${props => props.$isDark ? '#e5e7eb' : '#374151'};
    line-height: 1.6;
    margin-bottom: 1.5rem;

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

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    flex-wrap: wrap;

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s;

      &.cancel {
        background: ${props => props.$isDark ? '#4a5568' : '#e5e7eb'};
        color: ${props => props.$isDark ? '#f7fafc' : '#374151'};

        &:hover:not(:disabled) {
          background: ${props => props.$isDark ? '#718096' : '#d1d5db'};
        }
      }

      &.confirm {
        background: ${props =>
          props.$variant === "primary" ? "#10b981" : "#dc2626"};
        color: white;

        &:hover:not(:disabled) {
          background: ${props =>
            props.$variant === "primary" ? "#059669" : "#b91c1c"};
        }
      }

      &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
    }
  }
`;

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Texto do botão de confirmação (padrão: excluir) */
  confirmLabel?: string;
  /** Texto do botão cancelar (padrão: Cancelar) */
  cancelLabel?: string;
  /** danger = vermelho (padrão); primary = verde */
  variant?: "danger" | "primary";
  /** Se false, não exibe o ícone ⚠️ */
  showIcon?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Sim, deletar",
  cancelLabel = "Cancelar",
  variant = "danger",
  showIcon = true,
}: ConfirmModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Overlay $isOpen={isOpen} onClick={onCancel}>
      <Content $isDark={isDark} $variant={variant} onClick={(e) => e.stopPropagation()}>
        {showIcon ? <div className="icon">⚠️</div> : null}
        <h2>{title}</h2>
        <div className="message" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="actions">
          <button type="button" className="cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </Content>
    </Overlay>
  );
}
