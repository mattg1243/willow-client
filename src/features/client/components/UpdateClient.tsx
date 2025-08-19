import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { toaster } from "@/components/ui/toaster";
import { useUpdateClient } from "@/hooks/useClient";
import { Client } from "@/types/api";
import { Input } from "@chakra-ui/react";
import { DollarSign, Edit } from "lucide-react";
import { useRef, useState } from "react";
import { withMask } from "use-mask-input";

export function UpdateClient({ client }: { client: Client }) {
  const [open, setOpen] = useState<boolean>(false);
  const [clientState, setClientState] = useState<Client>(client);
  const [loading, setLoading] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: updateClientMutate } = useUpdateClient();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateClientMutate(clientState);
      toaster.create({
        type: "success",
        title: "Client updated successfully.",
      });
      setOpen(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Edit width={24} />
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Edit client</DialogTitle>
        </DialogHeader>
        <DialogBody alignItems="center" spaceY={8}>
          <Field
            label="First name"
            invalid={clientState.fname.length < 1}
            errorText="You must provide a first name to create a client">
            <Input
              onChange={(e) => {
                setClientState({ ...clientState, fname: e.target.value });
              }}
              value={clientState.fname}
            />
          </Field>
          <Field label="Last name">
            <Input
              onChange={(e) =>
                setClientState({ ...clientState, lname: e.target.value })
              }
              value={clientState.lname as string}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              onChange={(e) =>
                setClientState({ ...clientState, email: e.target.value })
              }
              value={clientState.email as string}
            />
          </Field>
          <Field
            label="Rate"
            invalid={!clientState.rate}
            errorText="A rate must be provided to created a client">
            <InputGroup startElement={<DollarSign size={16} />} width="100%">
              <Input
                onChange={(e) => {
                  setClientState({
                    ...clientState,
                    rate: parseFloat(e.target.value) * 100,
                  });
                }}
                type="number"
                value={clientState.rate ? clientState.rate / 100 : undefined}
              />
            </InputGroup>
          </Field>
          <Field label="Phone number">
            <Input
              ref={withMask("(999) 999-9999")}
              onChange={(e) =>
                setClientState({ ...clientState, phone: e.target.value })
              }
              type="tel"
              value={clientState.phone as string}
            />
          </Field>
          <Field label="Low balance threshold">
            <InputGroup startElement={<DollarSign size={16} />} width="100%">
              <Input
                onChange={(e) =>
                  setClientState({
                    ...clientState,
                    balancenotifythreshold: parseInt(e.target.value) * 100,
                  })
                }
                type="number"
                value={clientState.balancenotifythreshold / 100}
              />
            </InputGroup>
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={() => {
              handleSubmit();
            }}
            loading={loading}>
            Save client
          </Button>
          <DialogCloseTrigger />
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
