'use client'

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";

export default function PaymentConditionsPage() {
  return (
    <>
      <AdminHeader title="💵 Condições de Pagamento" showBackButton />
      <DataTable
      title="💵 Condições de Pagamento"
      apiEndpoint="/api/payment-conditions"
      columns={[
        { key: "legacyId", label: "Código" },
        { key: "name", label: "Nome da Condição" },
        { key: "installments", label: "Nº Parcelas" },
      ]}
      />
    </>
  );
}
