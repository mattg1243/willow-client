import { api } from "@/lib/api/apiClient";
import { User, UserContactInfo } from "@/types/api";
import { z } from "zod";

export const getUserContactInfo = async (): Promise<UserContactInfo> => {
  return await api.get("/user/contact-info");
};

export const updateUserSchema = z.object({
  user: z.object({
    fname: z.string().min(1, "First name is required"),
    lname: z.string().optional(),
    nameforheader: z.string().optional(),
    license: z.string().optional(),
    rate: z
      .number()
      .min(0, "Rate must be a positive number if provided")
      .optional(),
  }),
  contactInfo: z.object({
    phone: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    street: z.string().optional(),
    zip: z.string().optional(),
    paymentInfo: z.object({
      venmo: z.string().optional(),
      paypal: z.string().optional(),
    }),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateUser = async (data: UpdateUserInput): Promise<User> => {
  return await api.put("/user", data);
};

export const deleteUser = async () => {
  return await api.delete("/user");
};
