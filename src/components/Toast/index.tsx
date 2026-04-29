import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastContainer, ToastItem, IconWrapper, Content, CloseButton } from './styles';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <ToastContainer>
      <ToastItem type={type}>
        <IconWrapper>
          <Icon size={20} />
        </IconWrapper>
        <Content>{message}</Content>
        <CloseButton onClick={onClose}>
          <X size={16} />
        </CloseButton>
      </ToastItem>
    </ToastContainer>
  );
}
