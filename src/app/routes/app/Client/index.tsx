import { ClientLayout } from "@/components/layout/clientLayout";
import { paths } from "@/config/paths";
import { EventsTable } from "@/features/client/components/EventTable";
import { UpdateClient } from "@/features/client/components/UpdateClient";
import { StatementBtn } from "@/features/statement";
import { useClient } from "@/hooks/useClient";
import { getEventsByClient } from "@/lib/api/events";
import { ProtectedRoute } from "@/lib/auth";
import { makePayout } from "@/lib/payouts";
import { moneyToStr } from "@/utils/money";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BookMarked } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Payout } from "../../../../features/payouts/components/index";
import styles from "./Client.module.css";

export function ClientRoute() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const { data: client } = useClient(clientId as string);

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
  const totalBillings = events?.reduce((prev, curr) => prev + curr.amount, 0);

  return (
    <ProtectedRoute>
      {clientId && client ? (
        <ClientLayout title={`${client.fname} ${client.lname}`}>
          <VStack spaceY={4}>
            <HStack marginLeft={12}>
              <h1>{client.fname + " " + client.lname}</h1>
              <UpdateClient client={client} />
            </HStack>
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
            <HStack spaceX={12} justifyContent="space-around" width="80%">
              <VStack alignItems="flex-start" flex={1}>
                <div className={styles.infoCont}>
                  <div className={styles.infoRow}>
                    <h3>Retainer Balance:</h3>
                    <strong style={{ alignSelf: "end" }}>
                      <h3>{moneyToStr(client.balance)}</h3>
                    </strong>
                  </div>
                  <div className={styles.infoRow}>
                    <h3>Available Payout:</h3>
                    <strong>
                      <h3>{moneyToStr(payout?.payout as number)}</h3>
                    </strong>
                  </div>
                  <div className={styles.infoRow}>
                    <h3>Total Billings:</h3>
                    <h3>
                      <strong>{moneyToStr(totalBillings || 0)}</strong>
                    </h3>
                  </div>
                </div>
              </VStack>
              <VStack flex={1} alignItems="end">
                <Payout payout={payout} />
                <Button
                  variant="outline"
                  width="148px"
                  onClick={() =>
                    navigate(paths.app.payoutsClient.getHref(clientId))
                  }>
                  <h3>Payouts</h3>
                </Button>
                <StatementBtn events={events || []} client={client} />
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
