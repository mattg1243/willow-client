import { Event } from "@/types/api";

const COVER_PAGE_EVENTS = 15;
const PAGE_EVENTS = 25;

/**
 * Breaks array of events into chunks for multi page statements.
 */
export const chunkEvents = (events: Event[]): Event[][] => {
  const chunks: Event[][] = [];
  let i = 0;

  chunks.push(events.slice(i, i + COVER_PAGE_EVENTS));
  i += COVER_PAGE_EVENTS;

  while (i < events.length) {
    chunks.push(events.slice(i, i + PAGE_EVENTS));
    i += PAGE_EVENTS;
  }

  return chunks;
};
