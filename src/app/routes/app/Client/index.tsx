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

  const totalBillings = events?.reduce(
    (prev, curr) => prev + (curr.charge ? curr.amount : 0),
    0,
  );

  return (
    <ProtectedRoute>
      {clientId && client ? (
        <ClientLayout title={`${client.fname} ${client.lname}`}>
          <VStack spaceY={4}>
            <HStack>
              <strong>
                <h3>{client.fname + " " + client.lname}</h3>
              </strong>
              <UpdateClient client={client} />
            </HStack>
            {client.isarchived ? (
              <h3>
                Archived
                <BookMarked
                  size={12}
                  style={{
                    display: "inline",
                    marginLeft: 6,
                  }}
                />
              </h3>
            ) : null}
            <HStack spaceX={12} justifyContent="space-around" width="80%">
              <VStack alignItems="flex-start" flex={1}>
                <div className={styles.infoCont}>
                  <div className={styles.infoRow}>
                    <h5>Retainer Balance:</h5>
                    <strong style={{ alignSelf: "end" }}>
                      <h5>{moneyToStr(client.balance)}</h5>
                    </strong>
                  </div>
                  <div className={styles.infoRow}>
                    <h5>Available Payout:</h5>
                    <strong>
                      <h5>{moneyToStr(payout?.payout as number)}</h5>
                    </strong>
                  </div>
                  <div className={styles.infoRow}>
                    <h5>Total Billings:</h5>
                    <h5>
                      <strong>{moneyToStr(totalBillings || 0)}</strong>
                    </h5>
                  </div>
                </div>
              </VStack>
              <VStack flex={1} alignItems="end">
                <Payout payout={payout} />
                <Button
                  variant="outline"
                  width="126px"
                  onClick={() =>
                    navigate(paths.app.payoutsClient.getHref(clientId))
                  }>
                  <h4>Payouts</h4>
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
