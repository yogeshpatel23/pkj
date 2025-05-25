import { Schema, Types, models, model } from "mongoose";

export interface ILifoPosition {
  _id?: string;
  user: Types.ObjectId;
  symbol: string;
  token: string;
  buyDate: Date;
  quantity: number;
  buyPrice: number;
  investedAmount: number;
  fundedAmount: number;
  sellDate?: Date;
  sellPrice?: number;
  cmp: number;
}

const lifoPositionSchema = new Schema<ILifoPosition>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    token: { type: String, required: true },
    buyDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    buyPrice: { type: Number, required: true },
    investedAmount: { type: Number, required: true },
    fundedAmount: { type: Number, required: true },
    sellDate: { type: Date },
    sellPrice: { type: Number },
    cmp: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const LifoPosition =
  models.LifoPosition ||
  model<ILifoPosition>("LifoPosition", lifoPositionSchema);
export default LifoPosition;
