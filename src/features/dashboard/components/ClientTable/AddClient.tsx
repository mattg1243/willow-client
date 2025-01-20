import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import { createClient, CreateClientInput } from "@/lib/api/clients";
import { toaster } from "@/components/ui/toaster";
import { Field } from "@/components/ui/field";
import { Input } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { DollarSign } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AddClient() {
  const [open, setOpen] = useState<boolean>(false);
  const [fname, setFname] = useState<string>();
  const [noFname, setNoFname] = useState<boolean>(false);
  const [lname, setLname] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [rate, setRate] = useState<number>(10000);
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
        rate,
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
        <Button variant="outline" size="sm">
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
              placeholder="John"
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
            <Input
              placeholder="Doe"
              onChange={(e) => setLname(e.target.value)}
            />
          </Field>
          <Field label="Email">
            <Input
              placeholder="jdoe@email.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
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
                value={rate / 100}
              />
            </InputGroup>
          </Field>
          <Field label="Phone number">
            <Input onChange={(e) => setPhone(e.target.value)} type="tel" />
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
