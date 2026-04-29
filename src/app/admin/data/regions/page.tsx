'use client'

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";

export default function RegionsPage() {
  return (
    <>
      <AdminHeader title="Regiões" showBackButton />
      <DataTable
      title="Regiões"
      apiEndpoint="/api/regions"
      columns={[
        { key: "legacyId", label: "Código" },
        { key: "name", label: "Nome da Região" },
        { key: "tax", label: "Imposto", format: "percent" },
      ]}
      />
    </>
  );
}
