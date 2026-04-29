'use client'

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";

export default function AccountsPage() {
  return (
    <>
      <AdminHeader title="Contas a Pagar/Receber" showBackButton />
      <DataTable
      title="Contas a Pagar/Receber"
      apiEndpoint="/api/accounts"
      filters={[
        { key: "customerCode", label: "Código Cliente/Fornecedor", type: "text" },
        { 
          key: "paymentType", 
          label: "Tipo de Pagamento", 
          type: "select",
          options: [
            { value: "DI", label: "Dinheiro" },
            { value: "CH", label: "Cheque" },
            { value: "DE", label: "Débito" },
            { value: "CR", label: "Crédito" },
          ]
        },
        { key: "dateFrom", label: "Data Inicial", type: "date" },
        { key: "dateTo", label: "Data Final", type: "date" },
      ]}
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
    </>
  );
}
