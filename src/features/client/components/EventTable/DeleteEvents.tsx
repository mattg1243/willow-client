import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@chakra-ui/react";
import { useState } from "react";

export type EventTableActionBarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => Promise<void>;
  // add btn as dialog trigger as optional prop
};

export function DeleteEvents({
  open,
  setOpen,
  onDelete,
}: EventTableActionBarProps) {
  const [deleteModalInput, setDeleteModalInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
          </DialogHeader>
          <DialogBody spaceY={6}>
            <p>
              Deleting events is an irreversible action. To confirm, type
              "delete" into the text box and click the delete button.
            </p>
            <Input
              placeholder="delete"
              onChange={(v) => setDeleteModalInput(v.target.value)}
            />
            <Button
              disabled={deleteModalInput !== "delete"}
              loading={loading}
              onClick={handleDelete}>
              Delete
            </Button>
          </DialogBody>
          <DialogCloseTrigger />
          <DialogFooter />
        </DialogContent>
      </DialogRoot>
    </>
  );
}
