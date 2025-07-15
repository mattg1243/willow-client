import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { paths } from "@/config/paths";
import { api } from "@/lib/api/apiClient";
import { Card, Checkbox, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ResetPasswordForm() {
  const [password, setPassword] = useState<string>();
  const [confirm, setConfirm] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      navigate(paths.auth.login.path);
    }
  }, [navigate, token]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (password === confirm) {
        await api.post("/new-password", { password, token });
        navigate(paths.auth.login.path);
        toaster.create({
          type: "success",
          title: "Your password has been set successfully, you may now login!",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card.Root maxWidth="480px" padding={12} shadow="lg">
      <Card.Title>Create your new password</Card.Title>
      <Card.Body gap="12" alignItems="center">
        <Field required label="Password">
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
          />
        </Field>
        <Field required label="Confirm password">
          <Input
            onChange={(e) => setConfirm(e.target.value)}
            type={showPassword ? "text" : "password"}
          />
        </Field>
        <Checkbox.Root
          checked={showPassword}
          onCheckedChange={(e) => setShowPassword(!!e.checked)}>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Show password</Checkbox.Label>
        </Checkbox.Root>
      </Card.Body>
      <Card.Footer justifyContent="center">
        <Button
          bg={"primary.400"}
          onClick={handleSubmit}
          loading={loading}
          disabled={password !== confirm}>
          Submit
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
