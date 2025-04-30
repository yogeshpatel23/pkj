import mongoose from "mongoose";
import { Schema, model } from "mongoose";

export interface IPosition {
  _id?: string;
  user: mongoose.Types.ObjectId;
  symbol: string;
  token: string;
  totalBought: number;
  totalSold: number;
  totalQuantity: number;
  totalProfit: number;
  totalInvestment: number;
  currentPrice: number;
  bidAmount: number;
  bidOn: number;
  bidNumber: number;
}

const positonSchema = new Schema<IPosition>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    token: { type: String, required: true },
    totalBought: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    totalInvestment: { type: Number, default: 0 },
    currentPrice: { type: Number, default: 0 },
    bidAmount: { type: Number, required: true },
    bidOn: { type: Number, required: true },
    bidNumber: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const Position =
  mongoose.models.Position || model<IPosition>("Position", positonSchema);
export default Position;
