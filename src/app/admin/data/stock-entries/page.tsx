'use client'

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";

export default function StockEntriesPage() {
  return (
    <>
      <AdminHeader title="Entradas de Estoque" showBackButton />
      <DataTable
      title="Entradas de Estoque"
      apiEndpoint="/api/stock-entries"
      filters={[
        { key: "productCode", label: "Código do Produto", type: "text" },
      ]}
      columns={[
        { key: "entryCode", label: "Código Entrada" },
        { key: "itemCode", label: "Código Item" },
        { key: "productCode", label: "Código Produto" },
        { key: "quantity", label: "Quantidade" },
        { key: "entryDate", label: "Data Entrada", format: "date" },
      ]}
      />
    </>
  );
}
