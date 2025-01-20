import "@tanstack/react-query";
import { AxiosError } from "axios";

type QueryKey = ["clients", "events" | "payouts", ...ReadonlyArray<unknown>];

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError;
    queryKey: QueryKey;
    mutationKey: QueryKey;
  }
}
