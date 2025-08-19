import { PaymentType } from "@/types/api";
import { api } from "./apiClient";

export const getPaymentTypes = async (): Promise<PaymentType[]> => {
  return await api.get("/payment-types");
};
