import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const typeColors = {
  success: { bg: '#10b981', border: '#059669' },
  error: { bg: '#dc2626', border: '#b91c1c' },
  warning: { bg: '#f59e0b', border: '#d97706' },
  info: { bg: '#3b82f6', border: '#2563eb' },
};

export const ToastItem = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  background: ${props => typeColors[props.type].bg};
  border-left: 4px solid ${props => typeColors[props.type].border};
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.3s ease-out;
  min-width: 320px;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(10px);
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Content = styled.div`
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.4;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;
