import { Client } from "@/types/api";
import { moneyToStr } from "@/utils/money";
import { Badge, HStack, Table, VStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { AlertCircleIcon, BookMarked } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { SortButton, SortByOptions, SortByOrder } from "./SortButton";
import { FilterButton, FilterOptions } from "./FilterButton";
import { AddClient } from "./AddClient";
import { ClientTableActionBar } from "./ActionBar";
import { deleteClients } from "@/lib/api/clients";
import { useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const pageSize = 5;

export type ClientTableProps = {
  clients: Array<Client>;
};

export function ClientTable({ clients }: ClientTableProps) {
  const [page, setPage] = useState<number>(1);
  const [selection, setSelection] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByOptions>("created_at");
  const [order, setOrder] = useState<SortByOrder>("asc");
  const [filter, setFilter] = useState<FilterOptions>("Active");
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const filtered =
      filter === "All"
        ? clients
        : clients.filter((c) => c.isarchived === (filter === "Archived"));

    const sortFn = (a: Client, b: Client): number => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      } else if (a[sortBy] > b[sortBy]) {
        return 1;
      } else {
        return 0;
      }
    };
    filtered.sort(sortFn);
    setFilteredClients(filtered);
    setPage(1);
  }, [sortBy, order, filter, clients]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleClients = filteredClients.slice(startRange, endRange);

  const hasSelection = selection.length > 0;

  const deleteClientsAction = async () => {
    if (selection.length > 0) {
      deleteClients(selection);
    }
  };

  const { mutateAsync: deleteClientsMutate } = useMutation({
    mutationFn: deleteClientsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return (
    <VStack width={"80%"} margin={16}>
      <HStack justifyContent="space-between" width="100%">
        <SortButton
          sortBy={sortBy}
          onSortByChange={setSortBy}
          order={order}
          onOrderChange={setOrder}
        />
        <AddClient />
        <FilterButton filter={filter} setFilter={setFilter} />
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
                  aria-label="Select client"
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
                <span
                  onClick={() => navigate(paths.app.client.getHref(client.id))}>
                  {client.fname} {client.lname}{" "}
                  {client.isarchived ? (
                    <BookMarked
                      size={12}
                      style={{
                        display: "inline",
                        marginLeft: 6,
                      }}
                    />
                  ) : null}
                </span>
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
        count={filteredClients.length}
        page={page}
        pageSize={5}
        onPageChange={(e) => setPage(e.page)}>
        <HStack wrap="wrap">
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
      <ClientTableActionBar
        open={hasSelection}
        selectionLength={selection.length}
        onArchive={() => console.log("archiveaction")}
        onDelete={() => {
          deleteClientsMutate();
        }}
      />
    </VStack>
  );
}
