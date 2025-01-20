import { Event } from "@/types/api";
import { HStack, Table, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { SortButton, SortByOptions, SortByOrder } from "./SortButton";
import { FilterButton, FilterOptions } from "./FilterButton";
import { deleteEvents } from "@/lib/api/events";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moneyToStr } from "../../../../utils/money";
import { AddEvent } from "./AddEvent";
import { UpdateEvent } from "./UpdateEvent";
import { EventsTableActionBar } from "./ActionBar";

const pageSize = 5;

export type EventsTableProps = {
  clientId: string;
  events?: Event[];
  loading: boolean;
};

export function EventsTable({ clientId, events, loading }: EventsTableProps) {
  const [page, setPage] = useState<number>(1);
  const [selection, setSelection] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByOptions>("created_at");
  const [order, setOrder] = useState<SortByOrder>("asc");
  const [filter, setFilter] = useState<FilterOptions>("All");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events || []);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (events) {
      const filtered =
        filter === "All"
          ? events
          : events.filter((e) => e.charge === (filter === "Charge"));

      const sortFn = (a: Event, b: Event): number => {
        if (a[sortBy] < b[sortBy]) {
          return -1;
        } else if (a[sortBy] > b[sortBy]) {
          return 1;
        } else {
          return 0;
        }
      };
      filtered.sort(sortFn);
      setFilteredEvents(filtered);
      setPage(1);
    }
  }, [sortBy, order, filter, events]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleEvents = filteredEvents
    ? filteredEvents.slice(startRange, endRange)
    : [];

  const hasSelection = selection.length > 0;

  const deleteEventsAction = async () => {
    if (selection.length > 0) {
      deleteEvents(selection, clientId);
    }
  };

  const { mutateAsync: deleteEventsMutation } = useMutation({
    mutationFn: deleteEventsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    },
  });

  return (
    <>
      <VStack width={"80%"} margin={16}>
        <HStack justifyContent="space-between" width="100%" alignItems="end">
          <SortButton
            sortBy={sortBy}
            onSortByChange={setSortBy}
            order={order}
            onOrderChange={setOrder}
          />
          <AddEvent clientId={clientId} />
          <FilterButton filter={filter} setFilter={setFilter} />
        </HStack>
        <Table.Root
          size="md"
          variant="outline"
          interactive
          striped
          height={550}
          minWidth={650}>
          <Table.Header>
            <Table.Row height={50}>
              <Table.ColumnHeader>Edit</Table.ColumnHeader>
              <Table.ColumnHeader>Event</Table.ColumnHeader>
              <Table.ColumnHeader>Amount</Table.ColumnHeader>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
              <Table.ColumnHeader>Paid</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {events
              ? visibleEvents.map((event) => (
                  <Table.Row key={event.id} height={50}>
                    <Table.Cell>
                      <Checkbox
                        top="1"
                        checked={selection.includes(event.id)}
                        onCheckedChange={(changes) => {
                          setSelection((prev) =>
                            changes.checked
                              ? [...prev, event.id]
                              : selection.filter(
                                  (eventId) => eventId !== event.id
                                )
                          );
                        }}
                      />
                      <UpdateEvent event={event} clientId={clientId} />
                    </Table.Cell>
                    <Table.Cell>{event.event_type_title}</Table.Cell>
                    <Table.Cell>{moneyToStr(event.amount)}</Table.Cell>
                    <Table.Cell>
                      {new Date(event.date).toDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Checkbox checked={event.paid} size="sm" readOnly />
                    </Table.Cell>
                  </Table.Row>
                ))
              : null}
          </Table.Body>
        </Table.Root>
        <PaginationRoot
          count={filteredEvents?.length || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={(e) => setPage(e.page)}>
          <HStack wrap="wrap">
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
        <EventsTableActionBar
          open={hasSelection}
          selectionLength={selection.length}
          onDelete={() => {
            deleteEventsMutation();
          }}
        />
      </VStack>
    </>
  );
}
