import { Button } from "@/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import {
  createListCollection,
  ListCollection,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { createEvent } from "@/lib/api/events";
import { getEventTypes } from "@/lib/api/eventTypes";
import { system } from "@/theme";
import { Input } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Info, PlusIcon } from "lucide-react";

export function AddEvent({
  clientId,
  clientRate,
}: {
  clientId: string;
  clientRate: number;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState<number>(0);
  const [eventTypeId, setEventTypeId] = useState<string>();
  const [userEventTypes, setUserEventTypes] =
    useState<ListCollection<{ label: string; value: string }>>();
  const [rate, setRate] = useState<number>(clientRate);
  const [eventNotes, setEventNotes] = useState<string>("");
  const [statementNotes, setStatementNotes] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);

  const isPayment = () => {
    return eventTypeId === "4d9e9d8f-5f9f-4f9a-9b7d-7b5cf3e53d2e";
  };

  const loadEventTypes = async () => {
    setLoading(true);
    try {
      const eventTypes = await getEventTypes();
      const eventTypesList = createListCollection({
        items: eventTypes.map((e) => {
          return { label: e.title, value: e.id };
        }),
      });
      setUserEventTypes(eventTypesList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (): boolean => {
    if (isPayment() && amount && date && clientId && eventTypeId) {
      return true;
    } else if (
      !isPayment() &&
      duration &&
      date &&
      rate &&
      clientId &&
      eventTypeId
    ) {
      return true;
    } else {
      return false;
    }
  };

  const submit = async () => {
    const data = {
      event: {
        client_id: clientId,
        date: date.toISOString(),
        duration: isPayment() ? 0 : duration,
        event_type_id: eventTypeId as string,
        event_notes: eventNotes,
        statement_notes: statementNotes,
        rate: isPayment() ? 0 : rate,
        amount: isPayment() ? amount : rate * duration,
      },
    };
    console.log(data);
    if (validateInput()) {
      setLoading(true);

      try {
        await createEvent(data);
        toaster.create({ title: "Event created", type: "success" });
        setOpen(false);
      } catch (err: any) {
        console.error(err);
        toaster.create({
          title: "Error creating event: " + err?.message || err,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toaster.create({
        title: "Missing required fields: ",
        type: "error",
      });
    }
  };

  const { mutateAsync: addEventMutation } = useMutation({
    mutationFn: submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", clientId] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      queryClient.invalidateQueries({ queryKey: ["payouts", clientId] });
    },
  });

  useEffect(() => {
    loadEventTypes();
  }, []);

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <DialogBody spaceY={8} alignItems="center">
          <SelectRoot
            collection={userEventTypes as ListCollection}
            multiple={false}
            onValueChange={(e) => {
              console.log(e.value[0]);
              setEventTypeId(e.value[0]);
            }}>
            <SelectLabel>Event Type</SelectLabel>
            <SelectTrigger>
              <SelectValueText />
            </SelectTrigger>
            <SelectContent portalRef={contentRef}>
              {userEventTypes
                ? userEventTypes.items.map((item) => (
                    <SelectItem key={item.value} item={item}>
                      {item.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </SelectRoot>
          <Field label="Date">
            <Input
              type="date"
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </Field>
          <Field label="Duration">
            <InputGroup width={"100%"} endElement={<>hr</>}>
              <Input
                type="number"
                value={isPayment() ? 0 : duration}
                disabled={isPayment()}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
              />
            </InputGroup>
          </Field>
          <Field
            label={
              <>
                Statement Notes
                <Tooltip
                  openDelay={250}
                  closeDelay={250}
                  content="These notes will appear on your statements next to the associated event.">
                  <Info size={16} />
                </Tooltip>
              </>
            }
            helperText="Max characters 50">
            <InputGroup width={"100%"}>
              <Input
                maxLength={50}
                value={statementNotes}
                onChange={(e) => setStatementNotes(e.target.value)}
              />
            </InputGroup>
          </Field>
          <Field
            label={
              <>
                Event Notes
                <Tooltip
                  openDelay={250}
                  closeDelay={250}
                  content="These notes will not appear on you statements and are only visible to you.">
                  <Info size={16} />
                </Tooltip>
              </>
            }
            helperText="Max characters 500">
            <InputGroup width={"100%"}>
              <Textarea
                maxLength={500}
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
              />
            </InputGroup>
          </Field>
          <Field label="Rate">
            <InputGroup
              width={"100%"}
              startElement={<DollarSign size={16} />}
              endElement={<>per hr</>}>
              <Input
                type="number"
                readOnly={isPayment()}
                disabled={isPayment()}
                value={isPayment() ? 0 : rate / 100}
                onChange={(e) => setRate(parseInt(e.target.value) * 100)}
              />
            </InputGroup>
          </Field>
          <Field label="Amount">
            <InputGroup width={"100%"} startElement={<DollarSign size={16} />}>
              <Input
                type="number"
                readOnly={!isPayment()}
                disabled={!isPayment()}
                value={
                  isPayment()
                    ? (amount as number) / 100
                    : ((rate / 100) * duration).toFixed(2)
                }
                onChange={(e) => setAmount(parseFloat(e.target.value) * 100)}
              />
            </InputGroup>
          </Field>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button
              type="button"
              justifySelf="center"
              background={system.token("colors.primary.500")}
              loading={loading}
              onClick={() => {
                addEventMutation();
              }}>
              Save Event
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
