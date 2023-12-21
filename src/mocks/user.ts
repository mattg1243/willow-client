type User = {
  id: string;
  username: string;
  fname: string;
  lname: string;
  email: string;
  nameForHeader: string;
  phone: string;
  state: string;
  street: string;
  zip: string;
  license: string;
  paymentInfo: object;
};

export const MOCK_USER: User = {
  id: '12345-asdfg',
  username: 'mattg1243',
  fname: 'Matt',
  lname: 'Gallucci',
  email: 'mattgallucci97@gmail.com',
  nameForHeader: 'Dr. Matt Gallucci, M.F.C.',
  phone: '5555555555',
  state: 'CA',
  street: '1214 Maywood Ln',
  zip: '94553',
  license: 'MFC-123',
  paymentInfo: {},
};
