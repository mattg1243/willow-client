import { Client } from "@/types/api";
import { moneyToStr } from "@/utils/money";
import {
  ActionBarContent,
  Badge,
  HStack,
  Kbd,
  Table,
  VStack,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ActionBarRoot,
  ActionBarSeparator,
  ActionBarSelectionTrigger,
} from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { SortButton, SortByOptions, SortByOrder } from "./SortButton";
import { FilterButton } from "./FilterButton";
import { env } from "@/config/env";

const pageSize = 5;

export type ClientTableProps = {
  clients: Array<Client>;
};

export function ClientTable({ clients }: ClientTableProps) {
  const [page, setPage] = useState<number>(1);
  const [selection, setSelection] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByOptions>("created_at");
  const [order, setOrder] = useState<SortByOrder>("asc");
  const [archived, setArchived] = useState<boolean>(false);

  const filteredClients = clients.filter((c) => c.isarchived === archived);

  useEffect(() => {
    clients.filter((c) => c.isarchived === archived);
    const sortFn = (a: Client, b: Client): number => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      } else if (a[sortBy] > b[sortBy]) {
        return 1;
      } else {
        return 0;
      }
    };
    filteredClients.sort(sortFn);
  }, [sortBy, order, archived, clients, filteredClients]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleClients = clients.slice(startRange, endRange);

  const hasSelection = selection.length > 0;

  return (
    <VStack width={"80%"} margin={16}>
      <HStack justifyContent="space-between" width="100%">
        <SortButton
          sortBy={sortBy}
          onSortByChange={setSortBy}
          order={order}
          onOrderChange={setOrder}
        />
        <FilterButton archived={archived} setArchived={setArchived} />
      </HStack>
      <Table.Root size="md" variant="outline" interactive striped height={550}>
        <Table.Header>
          <Table.Row height={50}>
            <Table.ColumnHeader>Edit</Table.ColumnHeader>
            <Table.ColumnHeader>Client</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Balance</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {visibleClients.map((client) => (
            <Table.Row key={client.id} height={100}>
              <Table.Cell>
                <Checkbox
                  top="1"
                  aria-label="Select row"
                  checked={selection.includes(client.id)}
                  onCheckedChange={(changes) => {
                    setSelection((prev) =>
                      changes.checked
                        ? [...prev, client.id]
                        : selection.filter((clientId) => clientId !== client.id)
                    );
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                {client.fname} {client.lname}
              </Table.Cell>
              <Table.Cell textAlign="end">
                {client.balance <= client.balancenotifythreshold ? (
                  <Badge variant="solid" bg="error.500" marginX={6}>
                    <AlertCircleIcon size={12} />
                    Low
                  </Badge>
                ) : null}
                {moneyToStr(client.balance)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <PaginationRoot
        count={clients.length}
        page={page}
        pageSize={5}
        onPageChange={(e) => setPage(e.page)}>
        <HStack wrap="wrap">
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
      <ActionBarRoot open={hasSelection}>
        <ActionBarContent>
          <ActionBarSelectionTrigger>
            {selection.length} selected
          </ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <Button variant="outline">Archive</Button>
          <Button variant="outline">
            Delete <Kbd>⌫</Kbd>
          </Button>
        </ActionBarContent>
      </ActionBarRoot>
    </VStack>
  );
}
