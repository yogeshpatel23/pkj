import { Types, Schema, model, models } from "mongoose";

export interface IAccount {
  _id: string;
  user: Types.ObjectId;
  userId: string;
  password: string;
  totpCode: string;
  apiKey: string;
  apiSecret: string;
  token?: string;
  tokenExp?: string;
}

const accountSchema = new Schema<IAccount>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  userId: { type: String, required: true },
  password: { type: String, required: true },
  totpCode: { type: String, required: true },
  apiKey: { type: String, required: true },
  apiSecret: { type: String, required: true },
  token: { type: String },
  tokenExp: { type: String },
});

accountSchema.pre("save", function (next) {
  if (this.isModified("token")) {
    this.tokenExp = new Date().toDateString();
  }
  next();
});

const Account = models.Account || model<IAccount>("Account", accountSchema);

export default Account;
