import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";

export default function StockEntriesPage() {
  return (
    <>
      <PageHeader title="📥 Entradas de Estoque" />
      <DataTable
      title="📥 Entradas de Estoque"
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
