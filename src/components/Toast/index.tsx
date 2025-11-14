import { useEffect } from 'react';
import { ToastContainer, ToastItem } from './styles';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastContainer>
      <ToastItem type={type}>{message}</ToastItem>
    </ToastContainer>
  );
}
