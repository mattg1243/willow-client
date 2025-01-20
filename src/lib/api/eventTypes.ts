import { EventType } from "@/types/api";
import { z } from "zod";
import { api } from "./apiClient";

export const createEventTypeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  charge: z.boolean(),
});

type CreateEventTypeInput = z.infer<typeof createEventTypeSchema>;

export const createEventType = async (
  data: CreateEventTypeInput
): Promise<EventType> => {
  return api.post("/event-types", { eventType: data });
};

// Gets all event types for a user
export const getEventTypes = async (): Promise<EventType[]> => {
  return await api.get("/event-types");
};

// Gets one event type
export const getEventType = async (id: string): Promise<EventType | void> => {
  return api.get(`/event-types?id=${id}`);
};

export const updateEventTypeSchema = createEventTypeSchema.extend({
  id: z.string().min(1, "id is required to update an event type"),
});

type UpdateEventTypeInput = z.infer<typeof updateEventTypeSchema>;

export const updateEventType = async (
  data: UpdateEventTypeInput
): Promise<EventType> => {
  return api.put("/event-types", data);
};
