'use client'

import Link from "next/link";
import styled from "styled-components";

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    color: #101a33;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background: #6b7280;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background: #4b5563;
    }
  }
`;

interface PageHeaderProps {
  title: string;
  backHref?: string;
  backLabel?: string;
}

export default function PageHeader({ 
  title, 
  backHref = "/admin/system", 
  backLabel = "Voltar" 
}: PageHeaderProps) {
  return (
    <Header>
      <h1>{title}</h1>
      <Link href={backHref}>
        <button>
          {backLabel}
        </button>
      </Link>
    </Header>
  );
}
