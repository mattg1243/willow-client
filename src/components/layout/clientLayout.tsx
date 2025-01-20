import React from "react";
import { useUser } from "@/lib/auth";
import { Head } from "../seo/Head";
import { Header } from "../Header";
import { Text, VStack } from "@chakra-ui/react";

type ClientLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function ClientLayout({ title, children }: ClientLayoutProps) {
  const user = useUser();

  return (
    <>
      <Head title={title} />
      <Header user={user?.user} />
      <VStack width="100vw">{children}</VStack>
    </>
  );
}
