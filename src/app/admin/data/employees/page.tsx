import DataTable from "@/components/DataTable";

export default function EmployeesPage() {
  return (
    <DataTable
      title="👤 Funcionários"
      apiEndpoint="/api/employees"
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
  );
}
