import { z } from "zod";

export const RegistrationSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });
