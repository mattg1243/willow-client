import { getPaymentTypes } from "@/lib/api/paymentTypes";
import { PaymentType } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const usePaymentTypes = () => {
  return useQuery<PaymentType[]>({
    queryKey: ["payment-types"],
    queryFn: getPaymentTypes,
  });
};
