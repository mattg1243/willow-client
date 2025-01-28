import { ClientLayout } from "@/components/layout/clientLayout";
import { EventsTable } from "@/features/client/components/EventTable";
import { StatementBtn } from "@/features/statement";
import { getClient } from "@/lib/api/clients";
import { getEventsByClient } from "@/lib/api/events";
import { ProtectedRoute } from "@/lib/auth";
import { moneyToStr } from "@/utils/money";
import { VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function ClientRoute() {
  const { clientId } = useParams();

  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(clientId as string),
    enabled: !!clientId,
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", clientId],
    queryFn: () => getEventsByClient(clientId as string),
    enabled: !!clientId,
  });

  return (
    <ProtectedRoute>
      {clientId && client ? (
        <ClientLayout title={`${client.fname} ${client.lname}`}>
          <VStack spaceY={8}>
            <h1>{client.fname + " " + client.lname}</h1>
            <h3>{moneyToStr(client.balance)}</h3>
            <StatementBtn events={events || []} client={client}  />
            <EventsTable
              events={events || []}
              clientId={clientId}
              loading={eventsLoading}
            />
          </VStack>
        </ClientLayout>
      ) : null}
    </ProtectedRoute>
  );
}
