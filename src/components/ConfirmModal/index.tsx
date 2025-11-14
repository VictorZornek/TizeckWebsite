import styled from "styled-components";

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

const Content = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

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
    color: #374151;
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
      background: #fef2f2;
      border-left: 4px solid #dc2626;
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      color: #991b1b;
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

      &.cancel {
        background: #e5e7eb;
        color: #374151;

        &:hover {
          background: #d1d5db;
        }
      }

      &.confirm {
        background: #dc2626;
        color: white;

        &:hover {
          background: #b91c1c;
        }
      }
    }
  }
`;

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Overlay $isOpen={isOpen} onClick={onCancel}>
      <Content onClick={(e) => e.stopPropagation()}>
        <div className="icon">⚠️</div>
        <h2>{title}</h2>
        <div className="message" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="actions">
          <button className="cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm" onClick={onConfirm}>
            Sim, deletar
          </button>
        </div>
      </Content>
    </Overlay>
  );
}
