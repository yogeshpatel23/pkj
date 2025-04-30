import { z } from "zod";

export const TradeSchema = z.object({
  id: z.string().min(1, { message: "Symbol is required" }),
  symbol: z.string().min(1, { message: "Symbol is required" }),
  tradeDate: z.date({ required_error: "Date is required" }),
  tradeType: z.enum(["buy", "sell"], {
    errorMap: () => ({ message: "Invalid trade type" }),
  }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  price: z.number().min(0.01, { message: "Price must be at least 0.01" }),
  isBid: z.boolean().default(false),
});
