import { AuthLayout } from "@/components/layout/authLayout";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export function ResetPasswordRoute() {
  return (
    <AuthLayout title="Reset Password">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
