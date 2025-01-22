import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { ClientTable } from "@/features/dashboard/components/ClientTable";
import { api } from "@/lib/api/apiClient";
import { Client } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export function DashboardRoute() {
  const getClients = async (): Promise<Client[]> => {
    return await api.get("/client");
  };

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  return (
    <DashboardLayout title="Dashboard | Willow">
      <ClientTable clients={clients || []}></ClientTable>
    </DashboardLayout>
  );
}
