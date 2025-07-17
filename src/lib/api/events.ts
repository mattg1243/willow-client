import { Event } from "@/types/api";
import { z } from "zod";
import { api } from "./apiClient";

export const createEventSchema = z.object({
  event: z.object({
    client_id: z.string().min(1, "Client ID is required"),
    date: z.string().min(1, "Date is required"),
    duration: z.number().min(0, "Duration is required"),
    event_type_id: z.string().min(1, "Event Type ID is required"),
    event_notes: z.string(),
    statement_notes: z.string(),
    rate: z.number().optional(),
    amount: z.number().optional(),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const createEvent = async (data: CreateEventInput): Promise<void> => {
  return api.post("/event", data);
};

export const getEventsByClient = async (clientId: string): Promise<Event[]> => {
  return api.get("/event?clientId=" + clientId);
};

export const getEventsByPayout = async (payoutId: string): Promise<Event[]> => {
  return api.get("/event?payoutId=" + payoutId);
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  return api.get("/event?id=" + eventId);
};

export const updateEventSchema = createEventSchema.extend({
  event: createEventSchema.shape.event.extend({
    id: z.string().min(1, "ID is required"),
  }),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const updateEvent = async (data: UpdateEventInput): Promise<Event> => {
  return await api.put("/event", data);
};

export const deleteEvents = async (
  ids: string[],
  clientId: string
): Promise<void> => {
  let queryStr = "";
  for (const id of ids) {
    queryStr += `id=${id}&`;
  }
  return api.delete(`/event?${queryStr.slice(0, -1)}&client=${clientId}`);
};
