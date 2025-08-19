import { api } from "@/lib/api/apiClient";
import { Client } from "@/types/api";
import { z } from "zod";

export const createClientSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().optional(),
  email: z.string().email().optional(),
  rate: z.number().gt(0),
  phone: z.string().optional(),
  balanceNotifyThreshold: z.number().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const createClient = async (
  data: CreateClientInput
): Promise<Client> => {
  return api.post("/client", { client: data });
};

export const getClient = async (id: string): Promise<Client | void> => {
  return api.get(`/client?id=${id}`);
};

export const getClients = async (): Promise<Client[]> => {
  return api.get("/client");
};

export const updateClientSchema = createClientSchema.extend({
  id: z.string().min(1, "id is required to update a client"),
  fname: z.string().min(1, "First name is required"),
  lname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  balancenotifythreshol: z.number().optional().nullable(),
  rate: z.number().optional().nullable(),
  isarchived: z.boolean(),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export const updateClient = async (
  data: UpdateClientInput
): Promise<Client> => {
  return api.put("/client", { client: data });
};

export const archiveClients = async (ids: string[]): Promise<void> => {
  let queryStr = "";
  for (const id of ids) {
    queryStr += `id=${id}&`;
  }
  return api.put(`/client/archive?${queryStr.slice(0, -1)}`);
};

export const deleteClients = async (ids: string[]): Promise<void> => {
  let queryStr = "";
  for (const id of ids) {
    queryStr += `id=${id}&`;
  }
  return api.delete(`/client?${queryStr.slice(0, -1)}`);
};
