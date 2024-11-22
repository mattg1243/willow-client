import { ChakraProvider, Spinner, VStack } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { system } from "../theme";
import { UserProvider } from "@/lib/auth";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <VStack>
          <Spinner size="xl" />
        </VStack>
      }>
      <HelmetProvider>
        <ChakraProvider value={system}>
          <Toaster />
          <UserProvider>{children}</UserProvider>
        </ChakraProvider>
      </HelmetProvider>
    </React.Suspense>
  );
};
