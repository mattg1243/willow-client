import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthLayout } from "@/components/layout/authLayout";

export function LoginRoute() {
  return (
    <AuthLayout title="Login to your account">
      <LoginForm />
    </AuthLayout>
  );
}
