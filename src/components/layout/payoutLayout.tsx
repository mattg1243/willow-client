import { VStack } from "@chakra-ui/react";
import React from "react";
import { Header } from "../Header";
import { Head } from "../seo/Head";

type PayoutLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function PayoutLayout({ title, children }: PayoutLayoutProps) {
  return (
    <>
      <Head title={title} />
      <Header />
      <VStack width="100vw" paddingTop={100}>
        {children}
      </VStack>
    </>
  );
}
