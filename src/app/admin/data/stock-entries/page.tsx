import DataTable from "@/components/DataTable";

export default function StockEntriesPage() {
  return (
    <DataTable
      title="📥 Entradas de Estoque"
      apiEndpoint="/api/stock-entries"
      columns={[
        { key: "entryCode", label: "Código Entrada" },
        { key: "itemCode", label: "Código Item" },
        { key: "productCode", label: "Código Produto" },
        { key: "quantity", label: "Quantidade" },
        { key: "entryDate", label: "Data Entrada", format: "date" },
      ]}
    />
  );
}
