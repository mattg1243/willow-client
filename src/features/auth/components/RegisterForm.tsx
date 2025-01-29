import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { paths } from "@/config/paths";
import { register, RegisterInput } from "@/lib/auth";
import { Card, Input, Link, Text, VStack } from "@chakra-ui/react";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegisterForm() {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [rate, setRate] = useState<number>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    if (fname && lname && email && password && password === confirmPassword) {
      const data: RegisterInput = {
        user: {
          fname,
          lname,
          rate,
          email,
          password,
        },
        contactInfo: {
          phone: "",
          city: "",
          state: "",
          street: "",
          zip: "",
        },
      };
      try {
        await register(data);
        toaster.create({
          type: "success",
          title: "Your account has been created, you may now log in!",
        });
        navigate(paths.auth.login.getHref());
      } catch (err: any) {
        console.error(err);
        toaster.create({
          title:
            "An error occurred creating your account: " + err?.message || err,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toaster.create({ title: "Your passwords must match", type: "error" });
    }
    console.log("register clicked");
  };

  return (
    <Card.Root maxWidth="480px">
      <Card.Body gap="8">
        <Card.Title>Create your account</Card.Title>
        <Field label="First name" required>
          <Input onChange={(e) => setFname(e.target.value)} value={fname} />
        </Field>
        <Field label="Last name">
          <Input onChange={(e) => setLname(e.target.value)} value={lname} />
        </Field>
        <Field
          label="Pay rate"
          helperText="Your hourly rate, used to calculate event charges.">
          <InputGroup startElement={<DollarSign size={16} />} width={"100%"}>
            <Input
              type="number"
              onChange={(e) => setRate(parseInt(e.target.value) * 100)}
            />
          </InputGroup>
        </Field>
        <Field
          label="Email"
          required
          helperText="We'll never share your email"
          errorText="Your email is required to create an account">
          <Input onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" required errorText="A password is required">
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field
          label="Confirm password"
          required
          errorText="Please confirm your password">
          <PasswordInput
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
