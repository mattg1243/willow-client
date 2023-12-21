import { useEffect } from 'react';
import { VStack, HStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import clock from '../../../assets/clock.png';
import money from '../../../assets/money.png';
import bill from '../../../assets/bill.png';
import styles from './Splash.module.css';
import { color } from 'framer-motion';

export default function SplashPage() {
  useEffect(() => {
    console.log('splash page mounted');
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <VStack className={styles.cont}>
        <VStack className={styles['heading-cont']}>
          <h1 className={styles['willow-cursive']}>Willow</h1>
          <h3 className={styles['sub-heading']}>
            A free and easy way for professionals to track their time, manage retainers and invoice clients.
          </h3>
          <HStack spacing={10} style={{ padding: 'clamp(24px, 5vh, 100px)' }}>
            <>
              <Button
                className={styles['btn']}
                bg="brand.dark.purple"
                color="white"
                onClick={() => {
                  navigate('/register');
                }}
                size="lg"
              >
                Register
              </Button>
              <Button
                bg="brand.green"
                color="white"
                onClick={() => {
                  navigate('/');
                }}
                size="lg"
              >
                Log In
              </Button>
            </>
          </HStack>
        </VStack>
        <VStack className={styles['images-stack']} spacing={5} direction={window.innerWidth < 768 ? 'column' : 'row'}>
          <VStack className={styles['image-cont']} style={{ background: 'var(--primary)' }}>
            <img className={styles['image']} src={clock} alt="clock" />
            <h3 className={styles['sub-section-heading']} style={{ color: 'white' }}>
              Time Tracking
            </h3>
            <p className={styles['sub-section-p']} style={{ color: 'white' }}>
              Log events such as meetings, phone calls and emails. Track your billable time, bill rate and the total
              fees.
            </p>
          </VStack>
          <VStack className={styles['image-cont']}>
            <img className={styles['image']} src={money} alt="money" />
            <h3 className={styles['sub-section-heading']} style={{ color: 'var(--primary)' }}>
              Retainer Management
            </h3>
            <p className={styles['sub-section-p']}>
              Accept and manage retainers. Apply funds to a client account and bill against the balance.
            </p>
          </VStack>
          <VStack className={styles['image-cont']} style={{ background: 'var(--primary)' }}>
            <img className={styles['image']} src={bill} alt="bill" />
            <h3 className={styles['sub-section-heading']} style={{ color: 'white' }}>
              Statement Generator
            </h3>
            <p className={styles['sub-section-p']} style={{ color: 'white' }}>
              Prepare and send PDF statements to clients detailing activity by event or date range.
            </p>
          </VStack>
          <h3 style={{ margin: '2vh' }}>Try for free today!</h3>
          <a href="/register">Register Now</a>
        </VStack>
      </VStack>
    </>
  );
}
