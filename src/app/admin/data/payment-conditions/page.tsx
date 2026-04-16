import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";

export default function PaymentConditionsPage() {
  return (
    <>
      <PageHeader title="💵 Condições de Pagamento" />
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
