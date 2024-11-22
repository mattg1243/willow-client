import { Client, Event, EventType, User } from "@/types/api";

export const testUser: User = {
  id: "1b486bf2-a886-416e-99c7-b3be602a9b3e",
  fname: "John",
  lname: "Doe",
  email: "jdoe123@gmail.com",
  nameforheader: "J. Doe",
  license: "MF 416",
  created_at: "2024-10-21T12:04:22.120231Z",
  updated_at: "2024-10-21T12:04:30.093619Z",
};

export const testClient: Client = {
  id: "f720d216-4a2e-42f8-a95b-4d6678d397e1",
  user_id: "1b486bf2-a886-416e-99c7-b3be602a9b3e",
  fname: "Mark",
  lname: "Twain",
  email: "mtwainthman@gmail.com",
  phone: "222-222-2222",
  balance: 0,
  balancenotifythreshold: 100,
  rate: 250,
  isarchived: false,
  created_at: "2024-10-29T22:38:58.107718Z",
  updated_at: "2024-10-29T22:38:58.107718Z",
};

export const testEvent: Event = {
  id: "371f733f-b8ad-4759-a2b4-45823bab856c",
  user_id: "1b486bf2-a886-416e-99c7-b3be602a9b3e",
  client_id: "f720d216-4a2e-42f8-a95b-4d6678d397e1",
  date: "2024-01-07T15:04:05Z",
  duration: 1.0,
  event_type_id: "1a4f1c7d-2e2c-4b0c-9d60-3a2829f1c4de",
  detail: "Second meeting with client",
  rate: 12000,
  amount: 15000,
  running_balance: 0,
  paid: false,
  created_at: "2024-11-22T12:09:48.142682Z",
  updated_at: null,
};

export const testEventType: EventType = {
  id: "0ba7af45-69a3-4f68-9b4c-0af09cc4beb5",
  user_id: "1b486bf2-a886-416e-99c7-b3be602a9b3e",
  source: null,
  name: "Zoom Meeting",
  charge: true,
  created_at: "2024-11-22T12:10:52.590436Z",
  updated_at: "2024-11-22T12:10:52.590436Z",
};

// const testPayout: Payout = {
//   payout: 30000,
//   events: [
//     "371f733f-b8ad-4759-a2b4-45823bab856c",
//     "b3aa8ce3-2894-4b89-8014-aa8617b8798b",
//   ],
// };
