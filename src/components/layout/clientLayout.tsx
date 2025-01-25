import { VStack } from "@chakra-ui/react";
import React from "react";
import { Header } from "../Header";
import { Head } from "../seo/Head";

type ClientLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function ClientLayout({ title, children }: ClientLayoutProps) {
  return (
    <>
      <Head title={title} />
      <Header />
      <VStack width="100vw">{children}</VStack>
    </>
  );
}
