import { ClientLayout } from "@/components/layout/clientLayout";
import { EventsTable } from "@/features/client/components/EventTable";
import { getClient } from "@/lib/api/clients";
import { getEventsByClient } from "@/lib/api/events";
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

  return clientId && client ? (
    <ClientLayout title={`${client.fname} ${client.lname} | Willow`}>
      <VStack spaceY={8}>
        <h1>{client.fname + " " + client.lname}</h1>
        <h3>{moneyToStr(client.balance)}</h3>
        {events ? (
          <EventsTable
            events={events}
            clientId={clientId}
            loading={eventsLoading}
          />
        ) : (
          <h3>No events saved for this client</h3>
        )}
      </VStack>
    </ClientLayout>
  ) : null;
}
