import { ClientLayout } from "@/components/layout/clientLayout";
import { paths } from "@/config/paths";
import { EventsTable } from "@/features/client/components/EventTable";
import { UpdateClient } from "@/features/client/components/UpdateClient";
import { StatementBtn } from "@/features/statement";
import { getClient } from "@/lib/api/clients";
import { getEventsByClient } from "@/lib/api/events";
import { ProtectedRoute } from "@/lib/auth";
import { makePayout } from "@/lib/payouts";
import { moneyToStr } from "@/utils/money";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BookMarked } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Payout } from "../../../../features/payouts/components/index";

export function ClientRoute() {
  const { clientId } = useParams();
  const navigate = useNavigate();

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

  const { data: payout } = useQuery({
    queryKey: ["payouts", clientId],
    queryFn: () => makePayout(clientId as string),
    enabled: !!clientId,
  });

  const eventsCount = payout?.events ? payout.events.length : 0;

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
            <HStack spaceX={12}>
              <VStack>
                <h3>Balance</h3>
                <h3>{moneyToStr(client.balance)}</h3>
                <UpdateClient client={client} />
                <StatementBtn events={events || []} client={client} />
              </VStack>
              <VStack>
                <h3>Payable</h3>
                <p>
                  {moneyToStr(payout?.payout as number)},{" "}
                  {`${eventsCount} ${eventsCount !== 1 ? "events" : "event"}`}
                </p>
                <Payout payout={payout} />
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(paths.app.payoutsClient.getHref(clientId))
                  }>
                  View payouts
                </Button>
              </VStack>
            </HStack>
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
