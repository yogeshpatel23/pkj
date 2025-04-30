import { z } from "zod";

export const AccountSchema = z.object({
  userId: z
    .string()
    .trim()
    .min(1, { message: "User Id is required." })
    .max(10)
    .toUpperCase(),
  password: z.string().min(1, { message: "Password is required." }),
  totpCode: z.string().min(1, { message: "TOTP Code is required." }),
  apiKey: z.string().trim().min(1, { message: "Key is required." }).max(50),
  apiSecret: z.string().trim().min(1, { message: "Secret key is required." }),
  token: z.string().min(1).optional(),
  tokenExp: z.string().min(1).optional(),
});
