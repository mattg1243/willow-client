import { Card, Container, Input, VStack } from "@chakra-ui/react";

export function LoginRoute() {
  return (
    <Container>
      <VStack>
        <Card>
          <Input placeholder="Email" />
          <Input placeholder="Password" />
        </Card>
      </VStack>
    </Container>
  );
}
