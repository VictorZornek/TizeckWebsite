'use client'

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;



const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    color: #101a33;
    margin-bottom: 1.5rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    .info-item {
      h4 {
        color: #6b7280;
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
      }

      p {
        color: #101a33;
        font-weight: 500;
      }
    }
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<Record<string, string | number | null> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/company-settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    }
    setLoading(false);
  };

  return (
    <Container>
      <PageHeader title="🏭 Dados da Empresa" />
      <Main>
        {loading ? (
          <Loading>Carregando...</Loading>
        ) : !settings ? (
          <Loading>Nenhuma configuração encontrada</Loading>
        ) : (
          <Card>
            <h2>Informações da Empresa</h2>
            <div className="info-grid">
              <div className="info-item">
                <h4>Razão Social</h4>
                <p>{settings.companyName || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Nome Fantasia</h4>
                <p>{settings.tradeName || '-'}</p>
              </div>
              <div className="info-item">
                <h4>CNPJ</h4>
                <p>{settings.cnpj || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Inscrição Estadual</h4>
                <p>{settings.stateRegistration || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Endereço</h4>
                <p>{settings.address || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Bairro</h4>
                <p>{settings.neighborhood || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Cidade</h4>
                <p>{settings.city || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Estado</h4>
                <p>{settings.state || '-'}</p>
              </div>
              <div className="info-item">
                <h4>CEP</h4>
                <p>{settings.zipCode || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Telefone 1</h4>
                <p>{settings.phone1 || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Telefone 2</h4>
                <p>{settings.phone2 || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Email</h4>
                <p>{settings.email || '-'}</p>
              </div>
              <div className="info-item">
                <h4>Site</h4>
                <p>{settings.website || '-'}</p>
              </div>
              <div className="info-item">
                <h4>ISS %</h4>
                <p>{settings.iss || '-'}</p>
              </div>
            </div>
          </Card>
        )}
      </Main>
    </Container>
  );
}
