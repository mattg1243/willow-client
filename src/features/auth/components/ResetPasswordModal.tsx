import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api/apiClient";
import { Button, Input } from "@chakra-ui/react";
import { useRef, useState } from "react";

export const ResetPasswordModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const sendResetPasswordReq = async () => {
    setLoading(true);
    try {
      await api.post("/reset-password", { email });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="ghost">Forgot Password</Button>
      </DialogTrigger>
      <DialogContent ref={contentRef} alignSelf={"center"}>
        <DialogBody
          padding={8}
          alignItems="center"
          justifyContent="center"
          spaceY={8}>
          <p>Please enter the email you used to create your Willow account.</p>
          <Input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {submitted ? (
            <p>
              An email has been sent to the address provided with a link to set
              your new password.
            </p>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <Button
            loading={loading}
            loadingText="Sending email..."
            // disabled={submitted || !email}
            onClick={sendResetPasswordReq}
            style={{ background: "var(--willow-green)" }}>
            Reset password
          </Button>
          <DialogCloseTrigger />
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
