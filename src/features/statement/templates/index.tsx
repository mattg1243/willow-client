import { Event } from "@/types/api";

/**
 * Breaks array of events into chunks for multi page statements.
 */
export const chunkEvents = (events: Event[]): Event[][] => {
  const chunks: Event[][] = [];
  let i = 0;

  chunks.push(events.slice(i, i + 8));
  i += 8;

  while (i < events.length) {
    chunks.push(events.slice(i, i + 12));
    i += 12;
  }

  return chunks;
};
