import { z } from "zod";

export const NewPositonSchema = z.object({
  symbol: z.string().min(1, { message: "Symbol is required" }),
  token: z.string().min(1, { message: "Symbol is required" }),
  tradeDate: z.date({ required_error: "Date is required" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  price: z.number().min(0.01, { message: "Price must be at least 0.01" }),
  bidAmount: z.number().min(100, "BID Amount must be at least 100"),
  bidOn: z.number().min(1, "BID on must be at least 1%"),
});
