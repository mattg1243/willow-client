import { Event, Payout } from "@/types/api";
import { z } from "zod";
import { api } from "./api/apiClient";

export type MakePayoutRes = {
  payout: number;
  events: Array<Event>;
};

export const makePayout = async (clientId: string): Promise<MakePayoutRes> => {
  return api.get(`/payout/make?client=${clientId}`);
};

export const savePayoutSchema = z.object({
  payout: z.number(),
  events: z.string().array(),
  client_id: z.string(),
});

export type SavePayoutInput = z.infer<typeof savePayoutSchema>;

export const savePayout = async (data: SavePayoutInput): Promise<void> => {
  return api.post(`/payout`, data);
};

export const getPayouts = async (clientId?: string): Promise<Payout[]> => {
  return api.get(`/payout${clientId ? `?client=${clientId}` : ""}`);
};

export const getPayout = async (payoutId: string): Promise<Payout> => {
  return api.get(`/payout?id=${payoutId}`);
};

export const deletePayout = async (payoutId: string): Promise<void> => {
  return api.delete(`/payout?id=${payoutId}`);
};
