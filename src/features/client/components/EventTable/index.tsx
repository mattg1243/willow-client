import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { Client, type Event } from "@/types/api";
import { HStack, Spinner, Table, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { moneyToStr } from "../../../../utils/money";
import { EventForm } from "./EventForm";
import { FilterBtn, FilterOptions } from "./FilterBtn";
import { SortButton, SortByOptions, SortByOrder } from "./SortButton";

const pageSize = 10;

export type EventsTableProps = {
  client: Client;
  events: Event[];
  loading: boolean;
};

export function EventsTable({ client, events, loading }: EventsTableProps) {
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortByOptions>("created_at");
  const [order, setOrder] = useState<SortByOrder>("asc");
  const [filter, setFilter] = useState<FilterOptions>("All");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events || []);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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

  if (loading) {
    return <Spinner size={"xl"} color={"colors.primary.500"} />;
  }

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
          <EventForm
            mode="add"
            clientId={client.id}
            clientRate={client.rate}
          />
          <FilterBtn filter={filter} setFilter={setFilter} />
        </HStack>
        <Table.Root
          size="md"
          variant="outline"
          interactive
          striped
          height={550}
          minWidth={1000}>
          <Table.Header>
            <Table.Row height={25}>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
              <Table.ColumnHeader>Event</Table.ColumnHeader>
              <Table.ColumnHeader>Time</Table.ColumnHeader>
              <Table.ColumnHeader>Amount</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {events
              ? visibleEvents.map((event) => (
                  <Table.Row
                    key={event.id}
                    height={50}
                    onClick={() => setEditingEvent(event)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Cell>
                      {new Date(event.date).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{event.event_type_title}</Table.Cell>
                    <Table.Cell>
                      {event.duration === 0 ? "" : event.duration}
                    </Table.Cell>
                    <Table.Cell>{moneyToStr(event.amount)}</Table.Cell>
                  </Table.Row>
                ))
              : null}
            {
              // render empty rows to keep table height consistent
              visibleEvents.length < pageSize && <Table.Row></Table.Row>
            }
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
      </VStack>
      {editingEvent && (
        <EventForm
          mode="update"
          event={editingEvent}
          clientId={client.id}
          isOpen={true}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </>
  );
}
