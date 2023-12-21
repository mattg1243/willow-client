import { Client } from '../../mocks/client';

export const sortAtoZ = (name1: string, name2: string) => {
  if (name1 < name2) return -1;
  if (name1 > name2) return 1;
  // names must be equal
  return 0;
};

const sortZtoA = (name1: string, name2: string) => {
  if (name1 > name2) return -1;
  if (name1 < name2) return 1;
  // names must be equal
  return 0;
};

export const sortClients = (clientsArr: Client[], sortMethod: 0 | 1) => {
  // check for sortMethod before iterating through array
  let sortFunc: (name1: string, name2: string) => -1 | 0 | 1;
  if (sortMethod === 0) sortFunc = sortAtoZ;
  if (sortMethod === 1) sortFunc = sortZtoA;
  clientsArr.sort((a, b) => {
    // ignore case
    const name1 = a.fname.toUpperCase();
    const name2 = b.fname.toUpperCase();
    // sort it!
    return sortFunc(name1, name2);
  });
  return clientsArr;
};
