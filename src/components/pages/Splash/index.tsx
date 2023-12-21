import { useEffect } from 'react';
import { VStack, HStack, Stack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import clock from '../../../assets/clock.png';
import money from '../../../assets/money.png';
import bill from '../../../assets/bill.png';
import styles from './Splash.module.css';

export default function SplashPage() {
  useEffect(() => {
    console.log('splash page mounted');
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <VStack className={styles.cont}>
        <h1 className={styles['willow-cursive']}>Willow</h1>
        <h3 className={styles['sub-heading']}>
          A free and easy way for professionals to track their time, manage retainers and invoice clients.
        </h3>
        <HStack spacing={10} style={{ margin: '2rem' }}>
          <>
            <Button
              bg="brand.dark.purple"
              color="white"
              onClick={() => {
                navigate('/register');
              }}
            >
              Register
            </Button>
            <Button
              bg="brand.green"
              color="white"
              onClick={() => {
                navigate('/');
              }}
            >
              Log In
            </Button>
          </>
        </HStack>
        <VStack className={styles['images-stack']} spacing={5} direction={window.innerWidth < 768 ? 'column' : 'row'}>
          <VStack className={styles['image-cont']} style={{ background: 'var(--primary)' }}>
            <img className={styles['image']} src={clock} alt="clock" />
            <h3 style={{ fontSize: '2rem', color: 'white' }}>Time Tracking</h3>
            <p style={{ width: '33%', height: 'auto', color: 'white' }}>
              Log events such as meetings, phone calls and emails. Track your billable time, bill rate and the total
              fees.
            </p>
          </VStack>
          <VStack className={styles['image-cont']}>
            <img className={styles['image']} src={money} alt="money" />
            <h3 style={{ fontSize: '2rem' }}>Retainer Management</h3>
            <p style={{ width: '33%' }}>
              Accept and manage retainers. Apply funds to a client account and bill against the balance.
            </p>
          </VStack>
          <VStack className={styles['image-cont']} style={{ background: 'var(--primary)' }}>
            <img className={styles['image']} src={bill} alt="bill" />
            <h3 style={{ fontSize: '2rem', color: 'white' }}>Statement Generator</h3>
            <p style={{ width: '33%', color: 'white', marginBottom: '4rem' }}>
              Prepare and send PDF statements to clients detailing activity by event or date range.
            </p>
          </VStack>
          <h3>Try for free today!</h3>
        </VStack>
      </VStack>
    </>
  );
}
