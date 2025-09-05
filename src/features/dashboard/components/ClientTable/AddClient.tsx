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
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { toaster } from "@/components/ui/toaster";
import { createClient, CreateClientInput } from "@/lib/api/clients";
import { useUser } from "@/lib/auth";
import { Input } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { withMask } from "use-mask-input";

export function AddClient() {
  const { user } = useUser();

  const [open, setOpen] = useState<boolean>(false);
  const [fname, setFname] = useState<string>();
  const [noFname, setNoFname] = useState<boolean>(false);
  const [lname, setLname] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [rate, setRate] = useState<number | undefined>(
    (user?.rate as number) || undefined
  );
  const [noRate, setNoRate] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>();
  const [balanceNotifyThreshold, setBalanceNotifyThreshold] =
    useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const submit = async () => {
    if (fname) {
      setLoading(true);
      const data: CreateClientInput = {
        fname,
        lname,
        email,
        rate: rate as number,
        phone,
        balanceNotifyThreshold,
      };
      console.log("new client data:\n", data);
      try {
        await createClient(data);
        toaster.create({ title: "Client created", type: "success" });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setOpen(false);
      }
    } else {
      setNoFname(true);
    }
  };

  const { mutateAsync: addClientMutation } = useMutation({
    mutationFn: submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return (
    <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon size={16} />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New client</DialogTitle>
        </DialogHeader>
        <DialogBody spaceY={8}>
          <Field
            label="First name"
            invalid={noFname}
            errorText="You must provide a first name to create a client">
            <Input
              onChange={(e) => {
                setFname(e.target.value);
                if (e.target.value.length > 0) {
                  setNoFname(false);
                } else {
                  setNoFname(true);
                }
              }}
            />
          </Field>
          <Field label="Last name">
            <Input onChange={(e) => setLname(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field
            label="Rate"
            invalid={noRate}
            errorText="A rate must be provided to created a client">
            <InputGroup startElement={<DollarSign size={16} />} width="100%">
              <Input
                onChange={(e) => {
                  setRate(parseInt(e.target.value) * 100);
                  if (e.target.value.length > 0) {
                    setNoRate(false);
                  } else {
                    setNoRate(true);
                  }
                }}
                type="number"
                value={rate ? rate / 100 : undefined}
              />
            </InputGroup>
          </Field>
          <Field label="Phone number">
            <Input
              ref={withMask("(999) 999-9999")}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
          </Field>
          <Field label="Low balance threshold">
            <InputGroup startElement={<DollarSign size={16} />} width="100%">
              <Input
                onChange={(e) =>
                  setBalanceNotifyThreshold(parseInt(e.target.value) * 100)
                }
                type="number"
              />
            </InputGroup>
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button
            onClick={async () => {
              await addClientMutation();
            }}
            loading={loading}
            disabled={noFname || noRate || !fname}>
            Save
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
