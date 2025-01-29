import { ClientLayout } from "@/components/layout/clientLayout";
import { EventsTable } from "@/features/client/components/EventTable";
import { UpdateClient } from "@/features/client/components/UpdateClient";
import { StatementBtn } from "@/features/statement";
import { getClient } from "@/lib/api/clients";
import { getEventsByClient } from "@/lib/api/events";
import { ProtectedRoute } from "@/lib/auth";
import { moneyToStr } from "@/utils/money";
import { VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BookMarked } from "lucide-react";
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
          <VStack spaceY={4}>
            <h1>{client.fname + " " + client.lname}</h1>
            {client.isarchived ? (
              <h4>
                Archived
                <BookMarked
                  size={12}
                  style={{
                    display: "inline",
                    marginLeft: 6,
                  }}
                />
              </h4>
            ) : null}
            <h3>{moneyToStr(client.balance)}</h3>
            <UpdateClient client={client} />
            <StatementBtn events={events || []} client={client} />
            <EventsTable
              events={events || []}
              client={client}
              loading={eventsLoading}
            />
          </VStack>
        </ClientLayout>
      ) : null}
    </ProtectedRoute>
  );
}
