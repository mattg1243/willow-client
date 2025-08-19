import { Client } from "@/types/api";
import { createListCollection, Select } from "@chakra-ui/react";
import { useEffect } from "react";

export function ClientSelector({
  clients,
  value,
  onChange,
}: {
  clients: Client[];
  value?: string;
  all?: boolean;
  onChange: (clientId: string) => void;
}) {
  const clientsCollection = createListCollection({
    items: clients.map((client) => ({
      label: `${client.fname} ${client.lname}`,
      value: client.id,
    })),
  });

  clientsCollection.items.push({ label: "All", value: "" });

  useEffect(() => {
    console.log("clientId in selector: ", value);
  });

  return (
    <Select.Root
      collection={clientsCollection}
      multiple={false}
      value={value ? [value] : [""]}
      onValueChange={(c) => {
        onChange(c.items[0].value);
      }}>
      <Select.Label>Select client</Select.Label>
      <Select.Trigger>
        <Select.ValueText />
      </Select.Trigger>
      <Select.Content>
        {clientsCollection.items.map((client) => (
          <Select.Item item={client} key={client.value}>
            {client.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
