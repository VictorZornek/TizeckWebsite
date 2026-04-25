'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { Eye, EyeOff } from "lucide-react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    top: -250px;
    right: -250px;
    animation: ${float} 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    bottom: -200px;
    left: -200px;
    animation: ${float} 8s ease-in-out infinite;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 440px;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  p {
    color: #718096;
    font-size: 0.95rem;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-size: 0.9rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f7fafc;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: #a0aec0;
    }
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 3rem;
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }

  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 0.875rem;
  border-radius: 12px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid #fc8181;
  animation: ${fadeIn} 0.3s ease-out;
`;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Erro no login");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Header>
          <h1>Bem-vindo</h1>
          <p>Faça login para acessar o painel administrativo</p>
        </Header>
        
        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              placeholder="seu_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <label htmlFor="password">Senha</label>
            <PasswordInputWrapper>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TogglePasswordButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </TogglePasswordButton>
            </PasswordInputWrapper>
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </SubmitButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginForm>
      </LoginCard>
    </Container>
  );
}