'use client'

import Link from "next/link";
import styled from "styled-components";
import * as media from "@/styles/media";

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  ${media.down('md')} {
    padding: 1rem;
  }

  h1 {
    color: #101a33;
    font-size: 1.5rem;

    ${media.down('md')} {
      font-size: 1.25rem;
    }
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

    ${media.down('md')} {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

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
