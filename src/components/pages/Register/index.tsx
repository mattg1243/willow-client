import { useState } from 'react';
import { VStack, Container, Input, InputGroup, Divider, HStack, Tooltip, FormLabel, Button } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
// import BadInputAlert from './BadInputAlert';
import styles from './Register.module.css';
import PaymentInfoInput from '../../PaymentInfoInput/index';

export default function RegisterPage() {
  const [fname, setFname] = useState<string>();
  const [lname, setLname] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordConfirm, setPasswordConfirm] = useState<string>();
  const [nameForHeader, setNameForHeader] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [city, setCity] = useState<string>();
  const [state, setState] = useState<string>();
  const [zip, setZip] = useState<string>();
  const [badInput, setBadInput] = useState<boolean>(false);
  // const [errMsg, setErrMsg] = useState([]);
  const [checkField, setCheckField] = useState<string>();
  const [venmoField, setVenmoField] = useState<string>();
  const [paypalField, setPaypalField] = useState<string>();
  const [zelleField, setZelleField] = useState<string>();

  const navigate = useNavigate();

  const registerUser = async () => {
    console.log('user registered:' + email);
  };

  return (
    <>
      <Container className={styles['cont']}>
        <VStack spacing={5}>
          <InputGroup>
            <Input
              className={styles['input']}
              placeholder="First Name"
              type="text"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setFname(e.target.value);
              }}
            />
            <Input
              className={styles['input']}
              placeholder="Last Name"
              type="text"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setLname(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup>
            <Input
              className={styles['input']}
              placeholder="Email"
              type="email"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              className={styles['input']}
              placeholder="Username"
              type="text"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup>
            <Input
              className={styles['input']}
              placeholder="Password"
              type="password"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Input
              className={styles['input']}
              placeholder="Confirm Password"
              type="password"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
            />
          </InputGroup>
          <Divider orientation="horizontal" />
          <HStack style={{ justifyContent: 'center' }}>
            <h3>Info for Statement Header</h3>
            <Tooltip
              label="This information will be included in the header of all statements.
                            If you would like your name to appear with a title or as anything else than provided in the previous form,
                            enter it here."
            >
              <QuestionIcon />
            </Tooltip>
          </HStack>
          <InputGroup></InputGroup>
          <Input
            className={styles['input']}
            placeholder="Name to appear on statements"
            type="email"
            size="lg"
            focusBorderColor="brand.green"
            onChange={(e) => {
              setNameForHeader(e.target.value);
            }}
          />
          <Input
            className={styles['input']}
            placeholder="Phone Number"
            type="text"
            size="lg"
            focusBorderColor="brand.green"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <InputGroup>
            <Input
              className={styles['input']}
              placeholder="Street"
              type="text"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setStreet(e.target.value);
              }}
            />
            <Input
              className={styles['input']}
              placeholder="City"
              type="text"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup>
            <Input
              className={styles['input']}
              placeholder="State"
              type="text"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setState(e.target.value);
              }}
            />
            <Input
              className={styles['input']}
              placeholder="Zip"
              type="number"
              size="lg"
              focusBorderColor="brand.green"
              onChange={(e) => {
                setZip(e.target.value);
              }}
            />
          </InputGroup>
          <Tooltip
            label="This will tell your clients how you'd like to receive payment. 
                        It will show on the bottom of statements, but is not required (limited to 80 characters)."
          >
            <FormLabel>
              Payment Info <QuestionIcon style={{ color: 'grey' }} />
            </FormLabel>
          </Tooltip>
          {/* payment info fields */}
          <PaymentInfoInput fieldLabel="Check" stateName={checkField} stateSetter={setCheckField} />
          <PaymentInfoInput fieldLabel="Venmo" stateName={venmoField} stateSetter={setVenmoField} />
          <PaymentInfoInput fieldLabel="PayPal" stateName={paypalField} stateSetter={setPaypalField} />
          <PaymentInfoInput fieldLabel="Zelle  " stateName={zelleField} stateSetter={setZelleField} />
          {/* buttons */}
          <Button
            background="#63326E"
            color="#fff"
            onClick={() => {
              registerUser();
            }}
          >
            Register
          </Button>
        </VStack>
      </Container>
    </>
  );
}
