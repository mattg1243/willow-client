import { deletePayout } from "@/lib/payouts";
import { type Payout } from "@/types/api";
import { moneyToStr } from "@/utils/money";
import { HStack, IconButton, Spinner, Table, VStack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Undo } from "lucide-react";
import { useState } from "react";
import { EventsBtn } from "./EventsBtn";

const PAGE_SIZE = 5;

export function PayoutTable({
  payouts,
  loading,
  clientId,
}: {
  payouts: Payout[];
  loading: boolean;
  clientId: string | undefined;
}) {
  const [page, setPage] = useState<number>(1);

  const queryClient = useQueryClient();

  const startRange = (page - 1) * PAGE_SIZE;
  const endRange = startRange + PAGE_SIZE;

  const visiblePayouts = payouts.slice();

  const { mutateAsync: undoPayoutAsync } = useMutation({
    mutationFn: deletePayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts", clientId] });
      queryClient.invalidateQueries({ queryKey: ["saved-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["events", clientId] });
    },
  });

  if (loading) {
    return <Spinner size={"xl"} color={"colors.primary.500"} />;
  }

  return (
    <VStack width={"80%"} margin={16}>
      {/* top row for sort and client selector */}
      <HStack></HStack>
      <Table.Root
        size="md"
        variant="outline"
        interactive
        striped
        height={550}
        minWidth={650}>
        <Table.Header>
          <Table.Row height={50}>
            {!clientId ? <Table.ColumnHeader>Client</Table.ColumnHeader> : null}
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Events</Table.ColumnHeader>
            <Table.ColumnHeader>Undo</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {payouts ? (
            visiblePayouts.map((payout) => (
              <Table.Row>
                {!clientId ? (
                  <Table.Cell>
                    {payout.client_fname} {payout.client_lname}
                  </Table.Cell>
                ) : null}
                <Table.Cell>{moneyToStr(payout.amount)}</Table.Cell>
                <Table.Cell>{new Date(payout.date).toDateString()}</Table.Cell>
                <Table.Cell>
                  <EventsBtn payoutId={payout.id} />
                </Table.Cell>
                <Table.Cell>
                  <IconButton
                    onClick={() => undoPayoutAsync(payout.id)}
                    variant="ghost">
                    <Undo />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Spinner size={"lg"} />
          )}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
}
