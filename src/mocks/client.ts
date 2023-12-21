export type Client = {
  id: string;
  ownerId: string;
  fname: string;
  lname: string;
  email: string;
  balance: number;
  balanceNotifyThreshold: number;
  rate: number;
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: '67890-ghjkl',
    ownerId: '12345-asdfg',
    fname: 'John',
    lname: 'Smith',
    email: 'jsmith123@gmail.com',
    balance: 2500,
    balanceNotifyThreshold: 200,
    rate: 250,
    isArchived: false,
    created_at: '12-20-2023',
    updated_at: '12-20-23',
  },
  {
    id: 'asdfl-98237',
    ownerId: '12345-asdfg',
    fname: 'Jane',
    lname: 'Doe',
    email: 'jdoe23@gmail.com',
    balance: 5000,
    balanceNotifyThreshold: 500,
    rate: 250,
    isArchived: false,
    created_at: '12-20-2023',
    updated_at: '12-20-23',
  },
  {
    id: 'asdfl-98237',
    ownerId: '12345-asdfg',
    fname: 'Paul',
    lname: 'Craig',
    email: 'pcraig123@gmail.com',
    balance: 500,
    balanceNotifyThreshold: 100,
    rate: 250,
    isArchived: false,
    created_at: '12-20-2023',
    updated_at: '12-20-23',
  },
];
