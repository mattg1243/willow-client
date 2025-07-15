import {
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { ActionBarContent, Kbd } from "@chakra-ui/react";
import { useState } from "react";
import { DeleteEvents } from "./DeleteEvents";

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

  return (
    <>
      <DeleteEvents
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onDelete={onDelete}
      />
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
