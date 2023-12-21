import { useEffect } from 'react';
import { VStack, HStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styles from './Splash.module.css';
import subSections, { ISubSection } from './subSections';

export default function SplashPage() {
  useEffect(() => {
    console.log('splash page mounted');
  }, []);

  const navigate = useNavigate();

  const renderSubSection = (s: ISubSection) => {
    return (
      <VStack className={styles['image-cont']} style={{ background: s.bg, color: s.color }}>
        <img className={styles['image']} src={s.image} alt="clock" />
        <h3 className={styles['sub-section-heading']}>{s.heading}</h3>
        <p className={styles['sub-section-p']}>{s.subText}</p>
      </VStack>
    );
  };

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
          {subSections.map((s) => renderSubSection(s))}
          <h3 className={styles['sub-section-p']} style={{ margin: '2vh' }}>
            Try for free today!
          </h3>
          <a style={{ fontSize: 'clamp(18px, 2vw, 24px)' }} href="/register">
            Register Now
          </a>
        </VStack>
      </VStack>
    </>
  );
}
