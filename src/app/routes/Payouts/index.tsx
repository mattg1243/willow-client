import { PayoutLayout } from "@/components/layout/payoutLayout";
import { paths } from "@/config/paths";
import { ClientSelector } from "@/features/client/components/ClientSelector";
import { PayoutTable } from "@/features/payouts/components/PayoutTable";
import { getClient, getClients } from "@/lib/api/clients";
import { ProtectedRoute } from "@/lib/auth";
import { getPayouts } from "@/lib/payouts";
import { HStack, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { moneyToStr } from "../../../utils/money";

export function PayoutsRoute() {
  const { clientId } = useParams();

  const { data: payouts, isLoading: payoutsLoading } = useQuery({
    queryKey: ["saved-payouts", clientId],
    queryFn: () => getPayouts(clientId),
  });

  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(clientId as string),
    enabled: !!clientId,
  });

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(),
  });

  const getTotalPaid = (): number => {
    let total = 0;
    if (payouts) {
      payouts.map((p) => {
        total += p.amount;
      });
    }
    return total;
  };

  return (
    <ProtectedRoute>
      <PayoutLayout title={`Payouts${client ? ` | ${client.fname}` : ""}`}>
        <h3>
          {client
            ? `Payouts from ${client.fname} ${client.lname}`
            : "All payouts"}
        </h3>
        <HStack>
          <h5>Total paid: {moneyToStr(getTotalPaid())}</h5>
        </HStack>
        <HStack width={"20%"} textAlign="center" marginTop={6}>
          {clients ? (
            <ClientSelector
              clients={clients}
              onChange={(clientId) => {
                window.location.href =
                  paths.app.payoutsClient.getHref(clientId);
              }}
              value={clientId}
            />
          ) : (
            <Spinner size="sm" />
          )}
        </HStack>
        <PayoutTable
          payouts={payouts || []}
          loading={payoutsLoading}
          clientId={clientId}
        />
      </PayoutLayout>
    </ProtectedRoute>
  );
}
