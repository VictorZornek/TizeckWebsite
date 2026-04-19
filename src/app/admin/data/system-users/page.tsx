import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";

export default function SystemUsersPage() {
  return (
    <>
      <PageHeader title="🔑 Usuários do Sistema Legado" />
      <DataTable
      title="🔑 Usuários do Sistema Legado"
      apiEndpoint="/api/system-users"
      columns={[
        { key: "legacyId", label: "Código" },
        { key: "username", label: "Usuário" },
        { key: "employeeCode", label: "Código Funcionário" },
      ]}
      />
    </>
  );
}
