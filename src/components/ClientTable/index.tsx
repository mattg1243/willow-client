import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Badge,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  HStack,
  VStack,
  Heading,
  SimpleGrid,
  Spacer,
} from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
// import ClientSortMenu from './ClientSortMenu';
import { Client, MOCK_CLIENTS } from '../../mocks/client';
import { sortClients } from './sorters';
import ClientSortMenu from './ClientSortMenu';
import styles from './ClientTable.module.css';

interface IProps {
  archiveMode: boolean;
  addClientShown?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function ClientTable(props: IProps) {
  const { archiveMode, addClientShown } = props;

  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [sorting, setSorting] = useState<0 | 1>(0);

  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isDesktop = window.innerWidth > 1024;

  useEffect(() => {
    // const clientFilter = (client: Client) => {
    //   if (archiveMode && client.isArchived) {
    //     return true;
    //   } else if (!archiveMode && !client.isArchived) {
    //     return true;
    //   } else return false;
    // };
    const clients = sortClients(MOCK_CLIENTS, sorting);
    setClients(clients);
    console.log('clients:\n', clients);
  }, [archiveMode, sorting]);

  return (
    <>
      <HStack className={styles['top-stack']}>
        {isDesktop ? null : <ClientSortMenu setSorting={setSorting} />}
        <SimpleGrid columns={3} spacing={5} width="100%" justifyContent="space-between" alignItems="center">
          <Spacer />
          <Heading className={styles['heading']}>{archiveMode ? <>Closed Cases</> : <>Clients</>}</Heading>
          <VStack justifySelf="flex-end" justifyContent="flex-end">
            <Button
              variant="outline"
              color="white"
              bg={isDark ? 'brand.dark.purple' : 'brand.green'}
              className={styles['add-btn']}
              onClick={() => {
                // addClientShown(true);
              }}
            >
              Add
            </Button>
            {isDesktop ? <ClientSortMenu setSorting={setSorting} /> : null}
          </VStack>
        </SimpleGrid>
      </HStack>
      {/* table */}
      <Table size="lg" className={styles['table']} variant="striped">
        <Thead style={{ textAlign: 'center' }}>
          <Tr>
            <Th width="50%" style={{ textAlign: 'start' }}>
              Client
            </Th>
            <Th width="50%" style={{ textAlign: 'end' }}>
              Balance
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {clients.map((client) => {
            // create url endpoint based on archived status
            let endpoint = `/client/${client.id}`;
            if (client.isArchived) {
              endpoint += '?closed=true';
            }
            return (
              <Tr
                key={client.id}
                onClick={() => {
                  navigate(endpoint);
                }}
              >
                <Td>
                  {client.fname + ' ' + client.lname}
                  {client.balance > client.balanceNotifyThreshold ? null : (
                    <>
                      <Badge colorScheme="red" style={{ marginBottom: '.25rem', marginLeft: '1rem' }}>
                        LOW
                      </Badge>
                    </>
                  )}
                </Td>
                <Td isNumeric>${client.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}
