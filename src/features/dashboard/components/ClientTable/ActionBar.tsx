import { useState } from "react";
import {
  ActionBarRoot,
  ActionBarSeparator,
  ActionBarSelectionTrigger,
} from "@/components/ui/action-bar";
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
import { Button } from "@/components/ui/button";
import { ActionBarContent, Input, Kbd } from "@chakra-ui/react";

export type ClientTableActionBarProps = {
  open: boolean;
  selectionLength: number;
  onArchive: () => Promise<void>;
  onDelete: () => Promise<void>;
};

export function ClientTableActionBar({
  open,
  selectionLength,
  onArchive,
  onDelete,
}: ClientTableActionBarProps) {
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
              Deleting clients will permanently delete all data associated with
              them. To confirm your action, type "delete" into the text box and
              click the delete button.
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
          <DialogFooter />
        </DialogContent>
      </DialogRoot>
      <ActionBarRoot open={open}>
        <ActionBarContent>
          <ActionBarSelectionTrigger>
            {selectionLength} selected
          </ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <Button variant="outline" onClick={onArchive}>
            Archive
          </Button>
          <Button variant="outline" onClick={() => setDeleteModalOpen(true)}>
            Delete <Kbd>⌫</Kbd>
          </Button>
        </ActionBarContent>
      </ActionBarRoot>
    </>
  );
}
