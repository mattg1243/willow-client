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
import { Tooltip } from "@/components/ui/tooltip";
import { usePaymentTypes } from "@/hooks/usePaymentTypes";
import {
  createEvent,
  deleteEvents,
  updateEvent,
  UpdateEventInput,
} from "@/lib/api/events";
import { getEventTypes } from "@/lib/api/eventTypes";
import { system } from "@/theme";
import { EventType, PaymentType, type Event } from "@/types/api";
import { Input } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Edit, Info, PlusIcon } from "lucide-react";

type CollectionItem = {
  label: string;
  value: string;
};

type EventFormProps = {
  mode: "add" | "update";
  clientId: string;
  clientRate?: number;
  event?: Event;
  isOpen?: boolean;
  onClose?: () => void;
};

export function EventForm({
  mode,
  clientId,
  clientRate = 0,
  event,
  isOpen = false,
  onClose,
}: EventFormProps) {
  const [open, setOpen] = useState<boolean>(isOpen);
  const [date, setDate] = useState<Date>(
    mode === "update" && event ? new Date(event.date) : new Date()
  );
  const [duration, setDuration] = useState<number>(
    mode === "update" && event ? (event.duration as number) : 0
  );
  const [eventTypeId, setEventTypeId] = useState<string | undefined>(
    mode === "update" && event ? event.event_type_id : undefined
  );
  const [paymentTypeId, setPaymentTypeId] = useState<number | undefined>(
    mode === "update" && event ? event.payment_type_id : undefined
  );
  const [userEventTypes, setUserEventTypes] =
    useState<ListCollection<CollectionItem>>();
  const [userPaymentTypes, setUserPaymentTypes] =
    useState<ListCollection<CollectionItem>>();
  const [rate, setRate] = useState<number>(
    mode === "update" && event ? event.rate : clientRate
  );
  const [eventNotes, setEventNotes] = useState<string>(
    mode === "update" && event ? (event.event_notes as string) : ""
  );
  const [statementNotes, setStatementNotes] = useState<string>(
    mode === "update" && event ? (event.statement_notes as string) : ""
  );
  const [amount, setAmount] = useState<number | undefined>(
    mode === "update" && event ? event.amount : undefined
  );
  const [paid, setPaid] = useState<boolean>(
    mode === "update" && event ? event.paid : false
  );
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: paymentTypes } = usePaymentTypes();

  const eventTypeMap = useRef<Record<string, EventType>>({});

  const isPayment = () => {
    if (!eventTypeId) return false;
    if (!eventTypeMap.current[eventTypeId]) return false;
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
    setPaid(false);
  };

  const submitAdd = async () => {
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

  const submitUpdate = async () => {
    if (!event) return;

    setLoading(true);
    try {
      await updateEvent({
        event: {
          ...event,
          date: date.toISOString(),
          duration: isPayment() ? 0 : duration,
          event_type_id: eventTypeId as string,
          payment_type_id: paymentTypeId,
          event_notes: eventNotes,
          statement_notes: statementNotes,
          rate: isPayment() ? 0 : rate,
          amount: isPayment() ? amount : rate * duration,
          paid,
        },
      } as UpdateEventInput);
      toaster.create({
        type: "success",
        title: "Event updated successfully.",
      });
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toaster.create({ title: "Error updating event: " + err.message || err });
    } finally {
      setLoading(false);
    }
  };

  const deleteEventHandler = async () => {
    if (!event) return;

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

  const { mutateAsync: addEventMutation } = useMutation({
    mutationFn: submitAdd,
    onSuccess: onMutateSuccess,
  });

  const { mutateAsync: updateEventMutation } = useMutation({
    mutationFn: submitUpdate,
    onSuccess: onMutateSuccess,
  });

  const { mutateAsync: deleteEventMutation } = useMutation({
    mutationFn: deleteEventHandler,
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

  // Sync with event prop when in update mode
  useEffect(() => {
    if (mode === "update" && event) {
      setDate(new Date(event.date));
      setDuration(event.duration as number);
      setEventTypeId(event.event_type_id);
      setPaymentTypeId(event.payment_type_id);
      setRate(event.rate);
      setEventNotes(event.event_notes as string);
      setStatementNotes(event.statement_notes as string);
      setAmount(event.amount);
      setPaid(event.paid);
    }
  }, [mode, event]);

  // Sync open state with isOpen prop
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
        if (!e.open && onClose) {
          onClose();
        }
      }}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button variant="outline">
            <PlusIcon />
            Add Event
          </Button>
        ) : (
          <Icon size="md" style={{ marginTop: 4, marginLeft: 8 }}>
            <Edit />
          </Icon>
        )}
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody spaceY={8} alignItems="center">
          <HStack>
            <Select.Root
              collection={userEventTypes as ListCollection}
              multiple={false}
              value={eventTypeId ? [eventTypeId] : undefined}
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
                value={paymentTypeId ? [String(paymentTypeId)] : undefined}
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
              value={date.toISOString().split("T")[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </Field>
          <Field label="Duration">
            <HStack>
              <InputGroup width={"100%"} endElement={<>hr</>}>
                <Input
                  type="number"
                  value={
                    isPayment() ? 0 : duration === 0 ? "" : Math.floor(duration)
                  }
                  disabled={isPayment()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value === null) {
                      setDuration(Math.round((duration % 1) * 10) / 10);
                    } else {
                      const hours = parseFloat(value);
                      if (!isNaN(hours)) {
                        const currentMinutes = duration % 1;
                        setDuration(
                          Math.round((hours + currentMinutes) * 10) / 10
                        );
                      }
                    }
                  }}
                />
              </InputGroup>
              <MinuteSelect duration={duration} onChange={setDuration} />
            </HStack>
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
            <InputGroup width={"100%"} startElement={<DollarSign size={16} />}>
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
          {mode === "update" && !isPayment() ? (
            <Field alignItems="center">
              <Checkbox
                checked={paid}
                onCheckedChange={(e) => setPaid(!!e.checked)}>
                Paid
              </Checkbox>
            </Field>
          ) : null}
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            {mode === "update" && (
              <Button
                type="button"
                background={system.token("colors.error.400")}
                onClick={() => {
                  deleteEventMutation();
                }}>
                Delete event
              </Button>
            )}
            <Button
              type="button"
              justifySelf="center"
              background={system.token("colors.primary.500")}
              loading={loading}
              onClick={() => {
                if (mode === "add") {
                  addEventMutation();
                } else {
                  updateEventMutation();
                }
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

function MinuteSelect({
  duration,
  onChange,
}: {
  duration: number;
  onChange: (n: number) => void;
}) {
  return (
    <select
      style={{
        width: "200px",
        height: "40px",
        padding: "0 12px",
        borderRadius: "4px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
      defaultValue="0"
      onChange={(e) => {
        const newDuration = Math.floor(duration) + parseFloat(e.target.value);
        onChange(Math.round(newDuration * 10) / 10);
      }}>
      <option value="0">0 min</option>
      <option value="0.1">1-6 mins</option>
      <option value="0.2">7-12 mins</option>
      <option value="0.3">13-18 mins</option>
      <option value="0.4">19-24 mins</option>
      <option value="0.5">25-30 mins</option>
      <option value="0.6">31-36 mins</option>
      <option value="0.7">37-42 mins</option>
      <option value="0.8">43-48 mins</option>
      <option value="0.9">49-54 mins</option>
    </select>
  );
}
