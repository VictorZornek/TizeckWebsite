import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";

export default function OrderInstallmentsPage() {
  return (
    <>
      <PageHeader title="📅 Parcelas de Pedidos" />
      <DataTable
      title="📅 Parcelas de Pedidos"
      apiEndpoint="/api/order-installments"
      filters={[
        { key: "orderCode", label: "Código do Pedido", type: "text" },
        { 
          key: "status", 
          label: "Status", 
          type: "select",
          options: [
            { value: "P", label: "Pago" },
            { value: "A", label: "Aberto" },
            { value: "V", label: "Vencido" },
          ]
        },
      ]}
      columns={[
        { key: "orderCode", label: "Pedido" },
        { key: "installmentCode", label: "Parcela" },
        { key: "dueDate", label: "Vencimento", format: "date" },
        { key: "installmentValue", label: "Valor", format: "currency" },
        { key: "status", label: "Status" },
        { key: "paymentMethod", label: "Forma Pagamento" },
      ]}
      />
    </>
  );
}
