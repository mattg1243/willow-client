import { ChakraProvider, Spinner, VStack } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { system } from "../theme";
import { UserProvider } from "@/lib/auth";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type AppProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

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
          <ColorModeProvider>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <UserProvider>{children}</UserProvider>
            </QueryClientProvider>
          </ColorModeProvider>
        </ChakraProvider>
      </HelmetProvider>
    </React.Suspense>
  );
};
