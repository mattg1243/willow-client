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
  Icon,
  ListCollection,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { toaster } from "@/components/ui/toaster";
import { usePaymentTypes } from "@/hooks/usePaymentTypes";
import { deleteEvents, updateEvent, UpdateEventInput } from "@/lib/api/events";
import { getEventTypes } from "@/lib/api/eventTypes";
import { system } from "@/theme";
import { EventType, PaymentType, type Event } from "@/types/api";
import { Input } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Edit } from "lucide-react";

type CollectionItem = { label: string; value: string };

export function UpdateEvent({
  event,
  clientId,
}: {
  event: Event;
  clientId: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [eventState, setEventState] = useState<Event>(event);
  const [userEventTypes, setUserEventTypes] =
    useState<ListCollection<CollectionItem>>();
  const [userPaymentTypes, setUserPaymentTypes] =
    useState<ListCollection<CollectionItem>>();
  const [paymentTypeId, setPaymentTypeId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: paymentTypes } = usePaymentTypes();

  const eventTypeMap = useRef<Record<string, EventType>>({});

  const isPayment = () => {
    if (!eventState.event_type_id) return false;
    return !eventTypeMap.current[eventState.event_type_id].charge;
  };

  const submit = async () => {
    setLoading(true);
    console.log("eventState ", eventState);
    try {
      await updateEvent({
        event: {
          ...eventState,
          duration: isPayment() ? 0 : (eventState.duration as number),
          rate: isPayment() ? 0 : eventState.rate,
          amount: isPayment()
            ? eventState.amount
            : ((eventState.rate * eventState.duration) as number),
          payment_type_id: paymentTypeId,
        },
      } as UpdateEventInput);
      toaster.create({
        type: "success",
        title: "Event upadated successfully.",
      });
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toaster.create({ title: "Error updating event: " + err.message || err });
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async () => {
    try {
      await deleteEvents([event.id], clientId);
      toaster.create({
        type: "success",
        title: "Event deleted successfully.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onMutateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["events", clientId] });
    queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    queryClient.invalidateQueries({ queryKey: ["payouts", clientId] });
  };

  const { mutateAsync: upadateEventMutation } = useMutation({
    mutationFn: submit,
    onSuccess: onMutateSuccess,
  });

  const { mutateAsync: deleteEventMutation } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: onMutateSuccess,
  });

  useEffect(() => {
    const loadEventTypes = async () => {
      setLoading(true);
      try {
        const eventTypes = await getEventTypes();
        eventTypes.forEach((et) => {
          eventTypeMap.current[et.id] = et;
        });
        console.log(eventTypeMap);
        const eventTypesList = createListCollection({
          items: eventTypes.map((e) => {
            return { label: e.title, value: String(e.id) };
          }),
        });
        const paymentTypeList = createListCollection({
          items: (paymentTypes as PaymentType[]).map((pt) => {
            return { label: pt.name, value: String(pt.id) };
          }),
        });

        setUserPaymentTypes(paymentTypeList);
        setUserEventTypes(eventTypesList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEventTypes();
  }, [paymentTypes]);

  useEffect(() => {
    setEventState(event);
  }, [event]);

  if (loading) return <></>;

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Icon size="md" style={{ marginTop: 4, marginLeft: 8 }}>
          <Edit />
        </Icon>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <DialogBody spaceY={8} alignItems="center">
          <HStack>
            <Select.Root
              collection={userEventTypes as ListCollection}
              multiple={false}
              value={[eventState.event_type_id]}
              onValueChange={(e) => {
                console.log(e.value[0]);
                setEventState({ ...eventState, event_type_id: e.value[0] });
              }}>
              <Select.Label>Event Type</Select.Label>
              <Select.Trigger>
                <Select.ValueText />
              </Select.Trigger>
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
                onValueChange={(e) => setPaymentTypeId(parseInt(e.value[0]))}>
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
              value={eventState.date.split("T")[0]}
              onChange={(e) =>
                setEventState({
                  ...eventState,
                  date: new Date(e.target.value).toISOString(),
                })
              }
            />
          </Field>
          <Field label="Duration">
            <InputGroup width={"100%"} endElement={<>hr</>}>
              <Input
                type="number"
                value={isPayment() ? 0 : (eventState.duration as number)}
                disabled={isPayment()}
                onChange={(e) =>
                  setEventState({
                    ...eventState,
                    duration: parseFloat(e.target.value),
                  })
                }
              />
            </InputGroup>
          </Field>
          <Field label="Statement Notes" helperText="Max 50 characters">
            <InputGroup width={"100%"}>
              <Input
                maxLength={50}
                type="text"
                value={eventState.statement_notes as string}
                onChange={(e) =>
                  setEventState({
                    ...eventState,
                    statement_notes: e.target.value,
                  })
                }
              />
            </InputGroup>
          </Field>
          {/* add max characters to 500 */}
          <Field label="Event Notes" helperText="Max 500 characters">
            <InputGroup width={"100%"}>
              <Textarea
                maxLength={500}
                autoresize
                value={eventState.event_notes as string}
                onChange={(e) =>
                  setEventState({
                    ...eventState,
                    event_notes: e.target.value,
                  })
                }
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
                disabled={isPayment()}
                value={isPayment() ? 0 : eventState.rate / 100}
                onChange={(e) =>
                  setEventState({
                    ...eventState,
                    rate: parseInt(e.target.value) * 100,
                  })
                }
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
                    ? eventState.amount / 100
                    : (
                        ((eventState.rate / 100) *
                          eventState.duration) as number
                      ).toFixed(2)
                }
                onChange={(e) =>
                  setEventState({
                    ...eventState,
                    amount: parseFloat(e.target.value) * 100,
                  })
                }
              />
            </InputGroup>
          </Field>
          {isPayment() ? null : (
            <Field alignItems="center">
              <Checkbox
                checked={eventState.paid}
                onCheckedChange={(e) =>
                  setEventState({ ...eventState, paid: !!e.checked })
                }>
                Paid
              </Checkbox>
            </Field>
          )}
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button
              type="button"
              background={system.token("colors.error.400")}
              onClick={() => {
                deleteEventMutation();
              }}>
              Delete event
            </Button>
            <Button
              type="button"
              background={system.token("colors.primary.500")}
              justifySelf="center"
              loading={loading}
              onClick={() => {
                upadateEventMutation();
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
