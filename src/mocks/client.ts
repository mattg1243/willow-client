type Client = {
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

export const MOCK_CLIENT: Client = {
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
};
