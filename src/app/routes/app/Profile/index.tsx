import { ProfileLayout } from "@/components/layout/profileLayout";
import { UpdateUserForm } from "@/features/user/UpdateUserForm";
import { ProtectedRoute } from "@/lib/auth";
import { VStack } from "@chakra-ui/react";

export function ProfileRoute() {
  return (
    <ProtectedRoute>
      <ProfileLayout title="Profile">
        <VStack spaceY={8}>
          <UpdateUserForm />
        </VStack>
      </ProfileLayout>
    </ProtectedRoute>
  );
}
