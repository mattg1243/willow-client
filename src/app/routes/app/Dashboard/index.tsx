import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { toaster } from "@/components/ui/toaster";
import { ClientTable } from "@/features/dashboard/components/ClientTable";
import { api } from "@/lib/apiClient";
import { Client } from "@/types/api";
import { useEffect, useState } from "react";

export function DashboardRoute() {
  const [clients, setClients] = useState<Array<Client>>([]);

  const getClients = async (): Promise<{ data: Client[] }> => {
    return await api.get("/client");
  };

  useEffect(() => {
    getClients()
      .then((clients) => setClients(clients))
      .catch((err) =>
        toaster.create({ title: err.message || err, type: "error" })
      );
  }, []);

  return (
    <DashboardLayout title="Dashboard | Willow">
      <ClientTable clients={clients}></ClientTable>
    </DashboardLayout>
  );
}
