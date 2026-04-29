'use client'

import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Container, Overlay } from "./styles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Container $isDark={isDark} onClick={(e) => e.stopPropagation()}>
        {children}
      </Container>
    </Overlay>
  );
}