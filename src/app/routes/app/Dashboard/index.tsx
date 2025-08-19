import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { ClientTable } from "@/features/dashboard/components/ClientTable";
import { useClients } from "@/hooks/useClient";
import { ProtectedRoute } from "@/lib/auth";
import { Spinner, VStack } from "@chakra-ui/react";

export function DashboardRoute() {
  const { data: clients, isLoading } = useClients();

  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        <VStack spaceY={8}>
          <h1>Clients</h1>
          {isLoading ? (
            <Spinner size="xl" />
          ) : (
            <ClientTable clients={clients || []} />
          )}
        </VStack>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
