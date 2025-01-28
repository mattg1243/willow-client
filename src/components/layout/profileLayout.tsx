import { VStack } from "@chakra-ui/react";
import React from "react";
import { Header } from "../Header";
import { Head } from "../seo/Head";

export function ProfileLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Head title={title} />
      <Header />
      <VStack width="100vw">{children}</VStack>
    </>
  );
}
