import { Client, Event, User, UserContactInfo } from "@/types/api";

export type StatementData = {
  events: Event[];
  client: Client;
  user: User;
  userContactInfo: UserContactInfo;
  amountDue: number;
  currentBalance?: number;
  notes?: string;
};
