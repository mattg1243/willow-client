import { AuthLayout } from "@/components/layout/authLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export function RegisterRoute() {
  return (
    <AuthLayout title="Create your account">
      <RegisterForm />
    </AuthLayout>
  );
}
