import styled from "styled-components";
import * as media from "@/styles/media";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const Container = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d3748' : 'white'};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, ${props => props.$isDark ? '0.5' : '0.2'});
  transition: background 0.3s ease;

  ${media.down('md')} {
    padding: 1.5rem;
    width: 95%;
    max-height: 95vh;
  }

  h2 {
    margin-bottom: 1.5rem;
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};

    ${media.down('md')} {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
  }

  input, textarea, select {
    background: ${props => props.$isDark ? '#1a202c' : 'white'};
    color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
    border-color: ${props => props.$isDark ? '#4a5568' : '#ddd'};
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${props => props.$isDark ? '#cbd5e0' : '#666'};

    &:hover {
      color: ${props => props.$isDark ? '#f7fafc' : '#333'};
    }
  }
`;