import React from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { BiChevronDown } from 'react-icons/bi';

interface IProps {
  setSorting: React.Dispatch<React.SetStateAction<0 | 1>>;
}

export default function ClientSortMenu(props: IProps) {
  const { setSorting } = props;
  const isDesktop = window.innerWidth > 1024;

  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<BiChevronDown />}>
        {isDesktop ? <>Sort</> : null}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            setSorting(0);
          }}
        >
          A-Z
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSorting(1);
          }}
        >
          Z-A
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            setSorting(2);
          }}
        >
          Custom
        </MenuItem> */}
      </MenuList>
    </Menu>
  );
}
