'use client'

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";

export default function SystemUsersPage() {
  return (
    <>
      <AdminHeader title="Usuários do Sistema Legado" showBackButton />
      <DataTable
      title="Usuários do Sistema Legado"
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
