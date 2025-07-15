import { Header } from "@/components/Header";
import { Head } from "@/components/seo/Head";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    if (user?.user) {
      navigate(redirectTo ? redirectTo : paths.app.dashboard.getHref(), {
        replace: true,
      });
    }
  }, [user?.user, navigate, redirectTo]);

  return (
    <>
      <Head title={title} />
      <Header />
      <VStack
        minHeight="90vh"
        minWidth="100vw"
        justifyContent="center"
        alignItems="center"
        overflow="scroll"
        padding="24px">
        {children}
      </VStack>
    </>
  );
}
