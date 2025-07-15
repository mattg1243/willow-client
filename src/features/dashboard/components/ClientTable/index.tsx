import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup } from "@/components/ui/input-group";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { paths } from "@/config/paths";
import { archiveClients, deleteClients } from "@/lib/api/clients";
import { Client } from "@/types/api";
import { moneyToStr } from "@/utils/money";
import { Badge, HStack, Input, Table, VStack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon, BookMarked, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientTableActionBar } from "./ActionBar";
import { AddClient } from "./AddClient";
import { FilterButton, FilterOptions } from "./FilterButton";
import { SortButton, SortByOptions, SortByOrder } from "./SortButton";

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
  const [filteredClients, setFilteredClients] = useState<Client[]>(
    clients ?? []
  );
  const [searchTerm, setSearchTerm] = useState<string>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (clients) {
      let filtered =
        filter === "All"
          ? clients
          : clients.filter((c) => c.isarchived === (filter === "Archived"));

      const sortFn = (a: Client, b: Client): number => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        // Handle undefined/null cases
        if (aValue == null && bValue == null) {
          return 0;
        } else if (aValue == null) {
          return -1;
        } else if (bValue == null) {
          return 1;
        }

        if (aValue < bValue) {
          return -1;
        } else if (aValue > bValue) {
          return 1;
        } else {
          return 0;
        }
      };

      if (searchTerm) {
        const terms = searchTerm.toLowerCase().split(" ");
        filtered = filtered.filter((client) => {
          return terms.every((term) =>
            Object.values(client).some(
              (val) => val && String(val).toLowerCase().includes(term)
            )
          );
        });
      }

      filtered.sort(sortFn);
      setFilteredClients(filtered);
      setPage(1);
    }
  }, [sortBy, order, filter, clients, searchTerm]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleClients = clients
    ? filteredClients.slice(startRange, endRange)
    : [];

  const hasSelection = selection.length > 0;

  const deleteClientsAction = async () => {
    if (selection.length > 0) {
      deleteClients(selection);
    }
  };

  const archiveClientsAction = async () => {
    if (selection.length > 0) {
      archiveClients(selection);
    }
  };

  const { mutateAsync: deleteClientsMutate } = useMutation({
    mutationFn: deleteClientsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      selection.map((c) => {
        queryClient.invalidateQueries({ queryKey: ["events", c] });
      });
    },
  });

  const { mutateAsync: archiveClientsMutate } = useMutation({
    mutationFn: archiveClientsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return (
    <VStack width={"80%"} margin={16}>
      <HStack
        justifyContent="space-between"
        alignItems="end"
        width="100%"
        maxWidth={1200}>
        <SortButton
          sortBy={sortBy}
          onSortByChange={setSortBy}
          order={order}
          onOrderChange={setOrder}
        />
        <AddClient />
        <InputGroup
          startElement={<SearchIcon size={16} />}
          endElement={
            searchTerm ? (
              <XIcon size={16} onClick={() => setSearchTerm("")} />
            ) : null
          }>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            width="100%"
          />
        </InputGroup>
        <FilterButton filter={filter} setFilter={setFilter} />
      </HStack>
      <Table.Root
        size="md"
        variant="outline"
        tableLayout="auto"
        interactive
        height={550}
        maxWidth={1200}>
        <Table.Header>
          <Table.Row height={50}>
            <Table.ColumnHeader>Edit</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="start" width={200}>
              Client
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Balance</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {visibleClients.length < 1
            ? null
            : visibleClients.map((client) => (
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
                            : selection.filter(
                                (clientId) => clientId !== client.id
                              )
                        );
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell width={200}>
                    <span
                      onClick={() =>
                        navigate(paths.app.client.getHref(client.id))
                      }>
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
          {
            // render empty rows to keep table height consistent
            visibleClients.length < pageSize && <Table.Row></Table.Row>
          }
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
        onArchive={async () => {
          archiveClientsMutate();
        }}
        onDelete={async () => {
          deleteClientsMutate();
        }}
      />
    </VStack>
  );
}
