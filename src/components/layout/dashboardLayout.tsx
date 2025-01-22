import { useUser } from "@/lib/auth";
import { VStack } from "@chakra-ui/react";
import React from "react";
import { Header } from "../Header";
import { Head } from "../seo/Head";

type DashboardLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function DashboardLayout(props: DashboardLayoutProps) {
  const { title, children } = props;

  const user = useUser();

  return (
    <>
      <Head title={title} />
      <Header user={user?.user} />
      <VStack width="100vw">{children}</VStack>
    </>
  );
}
