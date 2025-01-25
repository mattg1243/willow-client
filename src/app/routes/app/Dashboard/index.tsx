import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { ClientTable } from "@/features/dashboard/components/ClientTable";
import { api } from "@/lib/api/apiClient";
import { ProtectedRoute } from "@/lib/auth";
import { Client } from "@/types/api";
import { VStack } from "@chakra-ui/react";
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
    <ProtectedRoute>
      <DashboardLayout title="Dashboard | Willow">
        <VStack spaceY={8}>
          <h1>Clients</h1>
          <ClientTable clients={clients || []}></ClientTable>
        </VStack>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
