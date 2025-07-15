export type BaseEntity = {
  id: string;
  created_at: string;
  updated_at: string | null;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<{
  fname: string;
  lname: string;
  email: string;
  nameforheader: string;
  license: string | null | undefined;
  rate: number | null | undefined;
}>;

type PaymentInfo = {
  zelle?: string | null | undefined;
  paypal?: string | null | undefined;
  venmo?: string | null | undefined;
};

export type UserContactInfo = Entity<{
  user_id: string;
  phone: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  street: string | null | undefined;
  zip: string | null | undefined;
  paymentinfo?: PaymentInfo;
}>;

export type Client = Entity<{
  user_id: string;
  fname: string;
  lname: string | null | undefined;
  email: string | null | undefined;
  phone: string | null | undefined;
  balance: number;
  balancenotifythreshold: number;
  rate: number;
  isarchived: boolean;
}>;

export type Event = Entity<{
  user_id: string;
  client_id: string;
  date: string;
  duration: number;
  event_type_id: string;
  event_type_title: string;
  detail: string | null | undefined;
  rate: number;
  amount: number;
  running_balance: number;
  paid: boolean;
  charge: boolean;
}>;

export type EventType = Entity<{
  user_id: string;
  source: string | null;
  title: string;
  charge: boolean;
}>;

export type Payout = Entity<{
  user_id: string;
  client_id: string;
  date: number;
  amount: number;
  client_fname: string;
  client_lname: string | null | undefined;
}>;
