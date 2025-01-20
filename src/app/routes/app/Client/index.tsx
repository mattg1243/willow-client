import { ClientLayout } from "@/components/layout/clientLayout";
import { toaster } from "@/components/ui/toaster";
import { getClient } from "@/lib/api/clients";
import { getEventsByClient } from "@/lib/api/events";
import { Client } from "@/types/api";
import { moneyToStr } from "@/utils/money";
import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { get } from "http";
import { EventsTable } from "@/features/client/components/EventTable";

export function ClientRoute() {
  const { clientId } = useParams();

  const { data: client, isLoading: clientLoading } = useQuery({
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
        <EventsTable events={events} clientId={clientId} />
      </VStack>
    </ClientLayout>
  ) : null;
}
