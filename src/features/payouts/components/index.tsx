import { Button } from "@/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { MakePayoutRes, savePayout } from "@/lib/payouts";
import { moneyToStr } from "@/utils/money";
import { List } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

export function Payout({ payout }: { payout: MakePayoutRes | undefined }) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { clientId } = useParams();
  const queryClient = useQueryClient();

  const contentRef = useRef<HTMLDivElement>(null);

  const submit = async () => {
    if (payout?.events && clientId) {
      setLoading(true);
      try {
        await savePayout({
          client_id: clientId,
          events: payout.events.map((e) => e.id),
          payout: payout.payout,
        });
        toaster.create({
          type: "success",
          title: "Payout completed succesfully.",
        });
        setOpen(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const { mutateAsync: savePayoutMutation } = useMutation({
    mutationFn: submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", clientId] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      queryClient.invalidateQueries({ queryKey: ["payouts", clientId] });
    },
  });

  if (!payout || !payout.events) {
    return <></>;
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button>Make payout</Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Make payout</DialogTitle>
        </DialogHeader>
        <DialogBody alignItems="center">
          These events will be marked as paid if you make a payout:
          <List.Root marginTop={6}>
            {payout.events.map((e) => (
              <List.Item>
                {e.event_type_title} on {new Date(e.date).toDateString()} for{" "}
                {moneyToStr(e.amount)}
              </List.Item>
            ))}
          </List.Root>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button>Cancel</Button>
            </DialogActionTrigger>
            <Button
              loading={loading}
              onClick={async () => {
                await savePayoutMutation();
              }}>
              Make payout
            </Button>
          </DialogFooter>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
