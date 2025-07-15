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
