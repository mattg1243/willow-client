import {
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
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
import { ActionBarContent, Input, Kbd } from "@chakra-ui/react";
import { useState } from "react";

export type EventTableActionBarProps = {
  open: boolean;
  selectionLength: number;
  onDelete: () => Promise<void>;
  clientId: string;
};

export function EventsTableActionBar({
  open,
  selectionLength,
  onDelete,
}: EventTableActionBarProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteModalInput, setDeleteModalInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      window.location.reload();
    }
  };

  return (
    <>
      <DialogRoot open={deleteModalOpen}>
        <DialogBackdrop />
        <DialogContent>
          <DialogCloseTrigger />
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
      <ActionBarRoot open={open}>
        <ActionBarContent>
          <ActionBarSelectionTrigger>
            {selectionLength} selected
          </ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <Button variant="outline" onClick={() => setDeleteModalOpen(true)}>
            Delete <Kbd>⌫</Kbd>
          </Button>
        </ActionBarContent>
      </ActionBarRoot>
    </>
  );
}
