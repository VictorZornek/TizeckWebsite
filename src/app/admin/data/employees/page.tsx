import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";

export default function EmployeesPage() {
  return (
    <>
      <PageHeader title="👤 Funcionários" />
      <DataTable
      title="👤 Funcionários"
      apiEndpoint="/api/employees"
      filters={[
        { key: "search", label: "Buscar por nome, CPF...", type: "text" },
        { 
          key: "active", 
          label: "Status", 
          type: "select",
          options: [
            { value: "S", label: "Ativo" },
            { value: "N", label: "Inativo" },
          ]
        },
      ]}
      columns={[
        { key: "legacyId", label: "Código" },
        { key: "name", label: "Nome" },
        { key: "shortName", label: "Nome Abreviado" },
        { key: "cpf", label: "CPF" },
        { key: "phone", label: "Telefone" },
        { key: "mobile", label: "Celular" },
        { key: "city", label: "Cidade" },
        { key: "active", label: "Ativo" },
        { key: "commission1", label: "Comissão %", format: "percent" },
      ]}
      />
    </>
  );
}
