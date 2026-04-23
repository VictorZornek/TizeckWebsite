import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label<{ $isDark?: boolean }>`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.$isDark ? '#f7fafc' : '#374151'};
`;

const SpecItem = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const Input = styled.input<{ $isDark?: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.$isDark ? '#4a5568' : '#ddd'};
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${props => props.$isDark ? '#1a202c' : 'white'};
  color: ${props => props.$isDark ? '#f7fafc' : '#101a33'};
  margin-bottom: 0 !important;

  &::placeholder {
    color: #9ca3af;
  }
`;

const RemoveButton = styled.button`
  padding: 0.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  &:hover {
    background: #b91c1c;
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;

  &:hover {
    background: #2563eb;
  }
`;

interface Specification {
  key: string;
  value: string;
}

interface SpecificationsEditorProps {
  value: string;
  onChange: (value: string) => void;
  isDark?: boolean;
}

export function SpecificationsEditor({ value, onChange, isDark }: SpecificationsEditorProps) {
  const [specs, setSpecs] = useState<Specification[]>([]);

  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
        const specsArray = Object.entries(parsed).map(([key, val]) => ({
          key,
          value: String(val)
        }));
        setSpecs(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
      } else {
        setSpecs([{ key: '', value: '' }]);
      }
    } catch {
      setSpecs([{ key: '', value: '' }]);
    }
  }, [value]);

  const updateParent = (newSpecs: Specification[]) => {
    const filtered = newSpecs.filter(s => s.key.trim() !== '');
    const obj = filtered.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    onChange(JSON.stringify(obj));
  };

  const handleAdd = () => {
    const newSpecs = [...specs, { key: '', value: '' }];
    setSpecs(newSpecs);
  };

  const handleRemove = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
    updateParent(newSpecs);
  };

  const handleChange = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
    updateParent(newSpecs);
  };

  return (
    <Container>
      <Label $isDark={isDark}>Especificações</Label>
      {specs.map((spec, index) => (
        <SpecItem key={index}>
          <Input
            $isDark={isDark}
            type="text"
            placeholder="Nome (ex: Peso)"
            value={spec.key}
            onChange={(e) => handleChange(index, 'key', e.target.value)}
          />
          <Input
            $isDark={isDark}
            type="text"
            placeholder="Valor (ex: 2.5kg)"
            value={spec.value}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
          />
          {specs.length > 1 && (
            <RemoveButton type="button" onClick={() => handleRemove(index)}>
              ×
            </RemoveButton>
          )}
        </SpecItem>
      ))}
      <AddButton type="button" onClick={handleAdd}>
        + Adicionar Especificação
      </AddButton>
    </Container>
  );
}
