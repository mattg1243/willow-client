import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Users,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/Header";
import styles from "./Landing.module.css";

export function LandingRoute() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleGetStarted = () => {
    if (user) {
      navigate(paths.app.dashboard.getHref());
    } else {
      navigate(paths.auth.register.getHref());
    }
  };

  useEffect(() => {
    if (user) {
      navigate(paths.app.dashboard.getHref());
    }
  }, [user, navigate]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <Container maxW="container.xl" py={20}>
          <VStack gap={8} textAlign="center">
            <Box>
              <h1 className={`${styles.heroTitle} willow-cursive`}>Willow</h1>
              <Heading
                as="h2"
                size="2xl"
                fontWeight="bold"
                color="gray.800"
                mt={4}>
                Billing made simple
              </Heading>
            </Box>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="2xl">
              Track hours, manage payments, and generate professional
              statements. Built for consultants, freelancers, and professionals
              who value simplicity.
            </Text>

            <HStack gap={4} mt={4}>
              <Button
                size="lg"
                colorScheme="green"
                onClick={handleGetStarted}
                px={8}
                py={6}
                fontSize="lg">
                Start for Free
              </Button>
            </HStack>

            <Text fontSize="sm" color="gray.500" mt={2}>
              No credit card required
            </Text>
          </VStack>
        </Container>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <Container maxW="container.xl" py={20}>
          <VStack gap={12}>
            <Box textAlign="center">
              <Heading size="xl" mb={4}>
                Everything you need. Nothing you don't.
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
                We're focused on one thing: making billing effortless for
                independent professionals.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} w="100%">
              <FeatureCard
                icon={<Clock size={32} />}
                title="Time Tracking"
                description="Log billable hours with precision. Track duration down to 6-minute increments for accurate billing."
              />
              <FeatureCard
                icon={<DollarSign size={32} />}
                title="Payment Management"
                description="Record payments and track outstanding balances. See exactly what you're owed at a glance."
              />
              <FeatureCard
                icon={<FileText size={32} />}
                title="Professional Statements"
                description="Generate clean, detailed statements for your clients. Export and send with confidence."
              />
              <FeatureCard
                icon={<Zap size={32} />}
                title="Lightning Fast"
                description="No bloat, no complexity. Add an event, record a payment, done. Get back to what matters."
              />
              <FeatureCard
                icon={<Users size={32} />}
                title="Client Management"
                description="Organize all your clients in one place. Set custom rates and track retainers effortlessly."
              />
              <FeatureCard
                icon={<CheckCircle size={32} />}
                title="Dead Simple"
                description="If you've used a spreadsheet, you can use Willow. No training, no learning curve."
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <Container maxW="container.xl" py={20}>
          <VStack gap={12}>
            <Heading size="xl" textAlign="center">
              How it works
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="100%">
              <StepCard
                number="1"
                title="Add your clients"
                description="Set up your clients with their hourly rates and any retainer information."
              />
              <StepCard
                number="2"
                title="Track your time"
                description="Log billable hours and payments as you work. It takes seconds."
              />
              <StepCard
                number="3"
                title="Generate statements"
                description="Create professional statements with one click. Send and get paid."
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <Container maxW="container.xl" py={20}>
          <VStack gap={6} textAlign="center">
            <Heading size="xl">Ready to simplify your billing?</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join professionals who've ditched the spreadsheets and complicated
              software.
            </Text>
            <Button
              size="lg"
              colorScheme="green"
              onClick={handleGetStarted}
              px={8}
              py={6}
              fontSize="lg"
              mt={4}>
              Get Started Free
            </Button>
          </VStack>
        </Container>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <Container maxW="container.xl" py={8}>
          <Text textAlign="center" color="gray.600" fontSize="sm">
            © 2025 Willow. Built for professionals who value simplicity.
          </Text>
        </Container>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Box
      p={6}
      bg="white"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "lg",
        borderColor: "green.300",
      }}>
      <VStack align="start" gap={3}>
        <Box color="green.500">{icon}</Box>
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{description}</Text>
      </VStack>
    </Box>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <VStack gap={4} textAlign="center">
      <Box
        w={16}
        h={16}
        borderRadius="full"
        bg="green.500"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="2xl"
        fontWeight="bold">
        {number}
      </Box>
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  );
}
