import { Card, Input, VStack, Link, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getUser, login, LoginInput, useUser } from "@/lib/auth";
import { paths } from "@/config/paths";

export function LoginForm() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const userDispatch = useUser();

  const isEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (email && isEmail(email) && password) {
      setLoading(true);
      const data: LoginInput = {
        email,
        password,
      };

      try {
        await login(data);
        const user = await getUser();
        console.log(user);
        if (user && userDispatch) {
          userDispatch.dispatch({ type: "SET_USER", payload: user });
        } else {
          console.error("This component must be used with a user context");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card.Root maxWidth="480px" margin="16px">
      <Card.Body gap="8">
        <Card.Title>Login to your account</Card.Title>
        <Field label="Email" required errorText="An email is required to login">
          <Input
            placeholder="Email"
            onChange={(v) => setEmail(v.target.value)}
          />
        </Field>
        <Field
          label="Password"
          required
          errorText="A password is required to login">
          <Input
            placeholder="Password"
            type="password"
            onChange={(v) => setPassword(v.target.value)}
          />
        </Field>
        <VStack gap={4}>
          <Button
            bg={"primary.300"}
            onClick={handleSubmit}
            loading={loading}
            disabled={email && isEmail(email) && password ? false : true}>
            Login
          </Button>
          <Text textAlign="center">
            Don't have an account one? Create one for free{" "}
            <Link href={paths.auth.register.path}>here</Link>.
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
