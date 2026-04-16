import DataTable from "@/components/DataTable";

export default function AccountsPage() {
  return (
    <DataTable
      title="💳 Contas a Pagar/Receber"
      apiEndpoint="/api/accounts"
      columns={[
        { key: "legacyId", label: "Código" },
        { key: "customerSupplierCode", label: "Cliente/Fornecedor" },
        { key: "issueDate", label: "Data Emissão", format: "date" },
        { key: "dueDate", label: "Vencimento", format: "date" },
        { key: "installmentValue", label: "Valor", format: "currency" },
        { key: "paidValue", label: "Valor Pago", format: "currency" },
        { key: "paymentType", label: "Tipo" },
      ]}
    />
  );
}
