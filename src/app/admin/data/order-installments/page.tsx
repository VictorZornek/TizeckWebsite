import DataTable from "@/components/DataTable";

export default function OrderInstallmentsPage() {
  return (
    <DataTable
      title="📅 Parcelas de Pedidos"
      apiEndpoint="/api/order-installments"
      columns={[
        { key: "orderCode", label: "Pedido" },
        { key: "installmentCode", label: "Parcela" },
        { key: "dueDate", label: "Vencimento", format: "date" },
        { key: "installmentValue", label: "Valor", format: "currency" },
        { key: "status", label: "Status" },
        { key: "paymentMethod", label: "Forma Pagamento" },
      ]}
    />
  );
}
