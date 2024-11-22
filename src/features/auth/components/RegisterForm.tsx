import { toaster } from "@/components/ui/toaster";
import { RegisterInput } from "@/lib/auth";
import { Card, Input, Link, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import { paths } from "@/config/paths";

export function RegisterFrom() {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    if (fname && lname && email && password && password === confirmPassword) {
      const data: RegisterInput = {
        user: {
          fname,
          lname,
          email,
          password,
        },
      };
    } else {
      toaster.create({ title: "Your passwords must match", type: "error" });
    }
    console.log("register clicked");
  };

  return (
    <Card.Root width="480px">
      <Card.Body gap="8">
        <Card.Title>Create your account</Card.Title>
        <Field label="First name">
          <Input
            placeholder="Enter your first name"
            onChange={(v) => setFname(v)}
            value={fname}
          />
        </Field>
        <Field label="Last name">
          <Input
            placeholder="Last name"
            onChange={(v) => setLname(v)}
            value={lname}
          />
        </Field>
        <Field
          label="Email"
          required
          helperText="We'll never share your email"
          errorText="Your email is required to create an account">
          <Input placeholder="Email" onChange={(v) => setEmail(v)} />
        </Field>
        <Field label="Password" required errorText="A password is required">
          <Input placeholder="Password" onChange={(v) => setPassword(v)} />
        </Field>
        <Field
          label="Confirm password"
          required
          errorText="Please confirm your password">
          <Input
            placeholder="Confirm your password"
            onChange={(v) => setConfirmPassword(v)}
          />
        </Field>
      </Card.Body>
      <Card.Footer justifyContent="center">
        <VStack gap={4}>
          <Button bg={"primary.300"} onClick={handleSubmit} loading={loading}>
            Sign up
          </Button>
          <Text>
            Already have an account? Login{" "}
            <Link href={paths.auth.login.path}>here</Link>.
          </Text>
        </VStack>
      </Card.Footer>
    </Card.Root>
  );
}
