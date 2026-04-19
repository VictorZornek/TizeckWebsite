'use client'

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";

export default function CustomerItemsPage() {
  return (
    <>
      <AdminHeader title="Histórico de Compras por Cliente" showBackButton />
      <DataTable
      title="Histórico de Compras por Cliente"
      apiEndpoint="/api/customer-items"
      filters={[
        { key: "customerCode", label: "Código do Cliente", type: "text" },
      ]}
      columns={[
        { key: "customerCode", label: "Código Cliente" },
        { key: "itemCode", label: "Código Item" },
        { key: "quantity", label: "Quantidade" },
        { key: "value", label: "Valor", format: "currency" },
        { key: "discount", label: "Desconto", format: "currency" },
        { key: "date", label: "Data", format: "date" },
        { key: "tableUsed", label: "Tabela" },
      ]}
      />
    </>
  );
}
