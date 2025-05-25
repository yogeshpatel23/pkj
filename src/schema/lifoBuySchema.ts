import { z } from "zod";

export const LifoPositionSchema = z.object({
  symbol: z.string().min(1, { message: "Symbol is required" }),
  token: z.string().min(1, { message: "Symbol is required" }),
  buyDate: z.date({ required_error: "Date is required" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  buyPrice: z.number().min(0.01, { message: "Price must be at least 0.01" }),
  investedAmount: z
    .number()
    .min(0.01, { message: "Price must be at least 0.01" }),
});
