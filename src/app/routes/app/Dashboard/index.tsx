import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { toaster } from "@/components/ui/toaster";
import { ClientTable } from "@/features/dashboard/components/ClientTable";
import { api } from "@/lib/api/apiClient";
import { Client } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function DashboardRoute() {
  const getClients = async (): Promise<Client[]> => {
    return await api.get("/client");
  };

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  return (
    <DashboardLayout title="Dashboard | Willow">
      <ClientTable clients={clients || []}></ClientTable>
    </DashboardLayout>
  );
}
