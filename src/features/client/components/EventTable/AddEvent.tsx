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
  createListCollection,
  HStack,
  ListCollection,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { usePaymentTypes } from "@/hooks/usePaymentTypes";
import { createEvent } from "@/lib/api/events";
import { getEventTypes } from "@/lib/api/eventTypes";
import { system } from "@/theme";
import { EventType, PaymentType } from "@/types/api";
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
  type CollectionItem = {
    label: string;
    value: string;
  };

  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState<number>(0);
  const [eventTypeId, setEventTypeId] = useState<string>();
  const [paymentTypeId, setPaymentTypeId] = useState<number>();
  const [userEventTypes, setUserEventTypes] =
    useState<ListCollection<CollectionItem>>();
  const [userPaymentTypes, setUserPaymentTypes] =
    useState<ListCollection<CollectionItem>>();
  const [rate, setRate] = useState<number>(clientRate);
  const [eventNotes, setEventNotes] = useState<string>("");
  const [statementNotes, setStatementNotes] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: paymentTypes } = usePaymentTypes();

  const eventTypeMap = useRef<Record<string, EventType>>({});

  const isPayment = () => {
    if (!eventTypeId) return false;
    return !eventTypeMap.current[eventTypeId].charge;
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

  const clearInput = () => {
    setDate(new Date());
    setDuration(0);
    setEventTypeId(undefined);
    setRate(clientRate);
    setEventNotes("");
    setStatementNotes("");
    setAmount(undefined);
  };

  const submit = async () => {
    const data = {
      event: {
        client_id: clientId,
        date: date.toISOString(),
        duration: isPayment() ? 0 : duration,
        event_type_id: eventTypeId as string,
        payment_type_id: paymentTypeId,
        event_notes: eventNotes,
        statement_notes: statementNotes,
        rate: isPayment() ? 0 : rate,
        amount: isPayment() ? amount : rate * duration,
      },
    };
    if (validateInput()) {
      setLoading(true);

      try {
        await createEvent(data);
        clearInput();
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
    const loadEventTypes = async () => {
      setLoading(true);
      try {
        const eventTypes = await getEventTypes();
        eventTypes.forEach((et) => {
          eventTypeMap.current[et.id] = et;
        });
        const eventTypesList = createListCollection({
          items: eventTypes.map((e) => {
            return { label: e.title, value: e.id };
          }),
        });
        const paymentTypesList = createListCollection({
          items: (paymentTypes as PaymentType[]).map((pt) => {
            return { label: pt.name, value: String(pt.id) };
          }),
        });
        setUserEventTypes(eventTypesList);
        setUserPaymentTypes(paymentTypesList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEventTypes();
  }, [paymentTypes]);

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
          <HStack>
            <Select.Root
              collection={userEventTypes as ListCollection}
              multiple={false}
              onValueChange={(e) => {
                setEventTypeId(e.value[0]);
              }}>
              <Select.Label>Event Type</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {userEventTypes
                    ? userEventTypes.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))
                    : null}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            {isPayment() ? (
              <Select.Root
                collection={userPaymentTypes as ListCollection}
                multiple={false}
                onValueChange={(e) => {
                  setPaymentTypeId(parseInt(e.value[0]));
                }}>
                <Select.Label>Payment Type</Select.Label>
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {userPaymentTypes
                      ? userPaymentTypes.items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))
                      : null}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            ) : null}
          </HStack>
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
                value={isPayment() ? 0 : duration === 0 ? undefined : duration}
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
