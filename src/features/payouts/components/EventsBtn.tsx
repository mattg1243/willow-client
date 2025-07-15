import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getEventsByPayout } from "@/lib/api/events";
import { moneyToStr } from "@/utils/money";
import { Button, List, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

// change to accepting payoutId as prop and fetch the events
export function EventsBtn({ payoutId }: { payoutId: string }) {
  const [open, setOpen] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["payout-events", payoutId],
    queryFn: () => getEventsByPayout(payoutId),
    enabled: !!payoutId,
  });

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="ghost">View events</Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Events from payout</DialogTitle>
        </DialogHeader>
        <DialogBody spaceY={8} alignItems="center">
          These events are included in this payout:
          <List.Root marginTop={12}>
            {events && !isLoading ? (
              events.map((event) => (
                <List.Item>
                  {event.event_type_title} on{" "}
                  {new Date(event.date).toDateString()} for{" "}
                  {moneyToStr(event.amount)}
                </List.Item>
              ))
            ) : (
              <Spinner />
            )}
          </List.Root>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
