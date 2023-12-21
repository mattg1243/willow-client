import { Input, InputGroup, InputRightElement, Button, FormLabel } from '@chakra-ui/react';
import React from 'react';

interface IProps {
  fieldLabel: string;
  stateName: string | undefined;
  stateSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function PaymentInfoInput(props: IProps) {
  const { fieldLabel, state, stateSetter } = props;

  return (
    <InputGroup style={{ alignItems: 'center' }}>
      <FormLabel style={{ width: '100px' }}>{fieldLabel}</FormLabel>
      <Input
        type="text"
        value={state}
        onChange={(e) => {
          stateSetter(e.target.value);
        }}
        maxLength={80}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          onClick={() => {
            stateSetter('');
          }}
        >
          Clear
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
