import React, { useEffect } from "react";
import { VStack } from "@chakra-ui/react";
import { useUser } from "@/lib/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "@/config/paths";
import { Head } from "../seo/Head";
import { Header } from "../Header";

type AuthLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function AuthLayout(props: AuthLayoutProps) {
  const { title, children } = props;

  const user = useUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(user.user);
    if (user?.user) {
      navigate(redirectTo ? redirectTo : paths.app.dashboard.getHref(), {
        replace: true,
      });
    }
  }, [user?.user, navigate, redirectTo]);

  return (
    <>
      <Head title={title} />
      <Header user={user?.user} />
      <VStack
        minHeight="90vh"
        justifyContent="center"
        alignItems="center"
        overflow="scroll"
        padding="24px">
        {children}
      </VStack>
    </>
  );
}
