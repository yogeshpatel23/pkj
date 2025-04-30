import mongoose from "mongoose";
import { Schema, model } from "mongoose";

export interface ITransaction {
  _id?: string;
  user: mongoose.Types.ObjectId;
  symbol: string;
  quantity: number;
  price: number;
  tradeType: "buy" | "sell";
  tradeDate: Date;
  isBid: boolean;
  position: mongoose.Types.ObjectId;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tradeType: { type: String, enum: ["buy", "sell"], required: true },
    tradeDate: { type: Date, required: true },
    isBid: { type: Boolean, default: false },
    position: { type: Schema.Types.ObjectId, ref: "Position", required: true },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  mongoose.models.Transaction ||
  model<ITransaction>("Transaction", transactionSchema);
export default Transaction;
