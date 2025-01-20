import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  createListCollection,
  Icon,
  IconButton,
  ListCollection,
  Switch,
} from "@chakra-ui/react";
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

import { toaster } from "@/components/ui/toaster";
import { Field } from "@/components/ui/field";
import { Input } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { DollarSign, Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent, updateEvent } from "@/lib/api/events";
import { EventType } from "@/types/api";
import { getEventTypes } from "@/lib/api/eventTypes";
import { type Event } from "@/types/api";
import { Checkbox } from "@/components/ui/checkbox";

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
    useState<ListCollection<{ label: string; value: string }>>();
  const [missingFields, setMissingFields] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);

  const isPayment = () => {
    return eventState.event_type_id === "4d9e9d8f-5f9f-4f9a-9b7d-7b5cf3e53d2e";
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
        },
      });
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

  const { mutateAsync: upadateEventMutation } = useMutation({
    mutationFn: submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    },
  });

  useEffect(() => {
    loadEventTypes();
  }, []);

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Icon size="md" style={{ marginTop: 4, marginLeft: 8 }}>
          <Edit />
        </Icon>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <DialogBody spaceY={8} alignItems="center">
          <SelectRoot
            collection={userEventTypes}
            multiple={false}
            value={[eventState.event_type_id]}
            onValueChange={(e) => {
              console.log(e.value[0]);
              setEventState({ ...eventState, event_type_id: e.value[0] });
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
          <Field label="Rate">
            <InputGroup
              width={"100%"}
              startElement={<DollarSign size={16} />}
              endElement={<>per hr</>}>
              <Input
                type="number"
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
