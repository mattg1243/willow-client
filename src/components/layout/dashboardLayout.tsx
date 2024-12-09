import { useUser } from "@/lib/auth";
import React from "react";
import { Head } from "../seo/Head";
import { Header } from "../Header";
import { Text, VStack } from "@chakra-ui/react";

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
