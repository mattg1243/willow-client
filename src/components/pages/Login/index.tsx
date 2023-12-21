import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Input,
  Container,
  VStack,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import styles from './Login.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetModalShown, setResetModalShown] = useState(false);
  const [emailReset, setEmailReset] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = () => {
    // display spinner
    setLoading(true);
    // TODO: send login request to the server
    console.log('Login btn clicked with username: ', username, ' password: ', password);
  };

  const resetPassword = () => {
    axios
      .post('/user/resetpassword', {
        email: emailReset,
      })
      .then((response) => {
        console.log(response);
        window.alert('Please check your email to reset your password');
      });
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      loginUser();
    }
  };

  // check if user is being redirected here due to expired token
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (params.get('expired')) {
      setMessage('Your session has expired');
    }
  });

  return (
    <Container className={styles.container}>
      <VStack className={styles['login-container']}>
        <h3 className={styles['willow-cursive']}>Willow</h3>
        <VStack style={{ width: '20rem' }}>
          <Input
            className={styles['login-text-input']}
            placeholder="Username"
            autoCapitalize="none"
            type="text"
            variant="flushed"
            focusBorderColor="brand.green"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            className={styles['login-text-input']}
            placeholder="Password"
            type="password"
            variant="flushed"
            focusBorderColor="brand.green"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyPress={(e) => handleKeypress(e)}
          />
          <Alert status="error" style={{ display: message ? 'flex' : 'none' }}>
            <AlertIcon />
            <AlertTitle mr={2}>{message}</AlertTitle>
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => {
                window.location.search = '';
                setMessage('');
              }}
            />
          </Alert>
        </VStack>
        {loading ? (
          <Spinner className={styles['spinner-container']} color="brand.green" />
        ) : (
          <>
            <HStack className={styles['register-btn-container']}>
              <Button
                background="brand.dark.purple"
                color="#fff"
                onClick={() => {
                  navigate('/register');
                }}
              >
                Register
              </Button>
              <Button
                background="brand.green"
                color="#fff"
                onClick={(e) => {
                  e.preventDefault();
                  loginUser();
                }}
              >
                Login
              </Button>
            </HStack>
            <p
              onClick={() => {
                setResetModalShown(true);
              }}
              className={styles['reset-password-btn-text']}
            >
              Reset Password
            </p>
          </>
        )}
        <Modal
          isOpen={resetModalShown}
          onClose={() => {
            setResetModalShown(false);
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reset Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel>Please enter your email:</FormLabel>
              <Input
                type="email"
                onChange={(e) => {
                  setEmailReset(e.target.value);
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bg="brand.dark.purple"
                style={{ color: 'white' }}
                mr={3}
                onClick={() => {
                  resetPassword();
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  setResetModalShown(false);
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}
