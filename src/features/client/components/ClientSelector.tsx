import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";
import { Client } from "@/types/api";
import { createListCollection, SelectValueText } from "@chakra-ui/react";
import { useEffect } from "react";

export function ClientSelector({
  clients,
  value,
  onChange,
}: {
  clients: Client[];
  value?: string;
  onChange: (clientId: string) => void;
}) {
  const clientsCollection = createListCollection({
    items: clients.map((client) => ({
      label: `${client.fname} ${client.lname}`,
      value: client.id,
    })),
  });

  useEffect(() => {
    console.log("clientId in selector: ", value);
  });

  return (
    <SelectRoot
      collection={clientsCollection}
      multiple={false}
      value={value ? [value] : []}
      onValueChange={(c) => {
        onChange(c.items[0].value);
      }}>
      <SelectLabel>Select client</SelectLabel>
      <SelectTrigger>
        <SelectValueText />
      </SelectTrigger>
      <SelectContent>
        {clientsCollection.items.map((client) => (
          <SelectItem item={client} key={client.value}>
            {client.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
