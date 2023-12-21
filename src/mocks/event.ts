type Event = {
  id: string;
  clientId: string;
  date: string;
  duration: number;
  type: string;
  detail: string;
  rate: number;
  amount: number;
  newBalance: number;
};

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    clientId: '67890-ghjkl',
    date: '12-20-23',
    duration: 2,
    type: 'Meeting',
    detail: 'First meeting with new client',
    rate: 250,
    amount: 500,
    newBalance: 2000,
  },
  {
    id: '2',
    clientId: '67890-ghjkl',
    date: '12-21-23',
    duration: 1,
    type: 'Phone Call',
    detail: '',
    rate: 250,
    amount: 250,
    newBalance: 1750,
  },
  {
    id: '3',
    clientId: '67890-ghjkl',
    date: '12-21-23',
    duration: .2,
    type: 'Email',
    detail: '',
    rate: 250,
    amount: 50,
    newBalance: 1700,
  },
];
