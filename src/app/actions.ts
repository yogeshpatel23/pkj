"use server";

import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Account, { IAccount } from "@/models/Account.model";
import * as OTPAuth from "otpauth";
import { sha256 } from "js-sha256";
import Position, { IPosition } from "@/models/Position.model";
import Transaction, { ITransaction } from "@/models/Transaction.model";
import User from "@/models/User.model";
import { AccountSchema } from "@/schema/accountSchema";
import { RegistrationSchema } from "@/schema/registrationSchema";
import { TradeSchema } from "@/schema/tradeSchema";
import { MongooseError, Types } from "mongoose";
import { HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NewPositonSchema } from "@/schema/newPositionSchema";
import { getQuote } from "@/lib/flattrate";

export async function registerUser(prevState: any, formdata: FormData) {
  try {
    // Convert FormData to JSON object
    const data = Object.fromEntries(formdata.entries());

    // Validate the data
    const validateFields = RegistrationSchema.safeParse(data);
    if (!validateFields.success) {
      return {
        error: validateFields.error.flatten().fieldErrors,
      };
    }

    // Connect to the database
    await dbConnect();
    // Check if the user already exists
    const existingUser = await User.findOne({
      email: validateFields.data.email,
    });
    if (existingUser) {
      return {
        error: {
          global: "User already exists",
        },
      };
    }
    // Create a new user
    const newUser = await User.create(validateFields.data);
  } catch (error) {
    console.error("Error registerUser:", error);
    return {
      error: {
        global: "An error occurred while processing your request.",
      },
    };
  }
  redirect("/signin");
}

export async function getAccount() {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) throw new Error("Accessing without session");
    if (!session || !session.user?.id) return null;
    const user: string = session.user?.id;
    await dbConnect();
    const accounts: HydratedDocument<IAccount>[] = await Account.aggregate([
      {
        $match: {
          user: new Types.ObjectId(user),
        },
      },
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          user: {
            $toString: "$user",
          },
          userId: 1,
          password: 1,
          totpCode: 1,
          apiKey: 1,
          apiSecret: 1,
          token: 1,
          tokenExp: 1,
        },
      },
    ]);
    if (accounts.length === 0) return null;
    return accounts[0];
  } catch (error) {
    console.log("Error while getting account", error);
  }
}

export async function addAccount(prevState: any, formdata: FormData) {
  try {
    const data = Object.fromEntries(formdata.entries());
    const validatedFields = AccountSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        success: {},
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    console.log(validatedFields.data);
    const session: any = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error();
    const user = session.user.id;
    await dbConnect();
    const account: HydratedDocument<IAccount> | null = await Account.findOne({
      userId: validatedFields.data.userId,
    });
    if (account) {
      return {
        errors: {
          message: "User id Already Added to an account",
        },
      };
    }
    const newaccount: HydratedDocument<IAccount> = await Account.create({
      user,
      ...validatedFields.data,
    });
  } catch (error: any) {
    if (error instanceof MongooseError) {
      console.log(error);
      return {
        errors: {
          message: "All field are required",
        },
      };
    }
    return {
      errors: {
        message: "Something went wrong",
      },
    };
  }
  redirect("/");
}

export async function editAccount(formState: any, formdata: FormData) {
  // Todo:: Add error handel
  const rawData = Object.fromEntries(formdata.entries());
  const validatedFields = AccountSchema.safeParse(rawData);
  if (!validatedFields.success) {
    console.log("validatedFields error", validatedFields.error.formErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log(validatedFields.data);
  await dbConnect();
  let account = await Account.findByIdAndUpdate(
    { _id: rawData.id },
    validatedFields.data
  );
  redirect("/");
}

export async function getToken(formState: any, formdata: FormData) {
  const id = formdata.get("id");
  await dbConnect();
  const accounts: HydratedDocument<IAccount>[] = await Account.find({
    user: id,
  });
  if (accounts.length === 0) throw new Error("No accot for userr");
  const account = accounts[0];
  if (!account) return { message: "Daya kuch to gadbad hai" };
  try {
    const rsid = await fetch("https://authapi.flattrade.in/auth/session", {
      method: "POST",
      headers: { referer: "https://auth.flattrade.in/" },
    });
    const sid = await rsid.text();
    let totp = new OTPAuth.TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: account.totpCode,
    });

    let otp = totp.generate();
    const hashPass = sha256(account.password);
    const coderes = await fetch("https://authapi.flattrade.in/ftauth", {
      method: "POST",
      body: JSON.stringify({
        UserName: account.userId,
        Password: hashPass,
        PAN_DOB: otp,
        App: "",
        ClientID: "",
        Key: "",
        APIKey: account.apiKey,
        Sid: sid,
        Override: "",
        Source: "AUTHPAGE",
      }),
    });
    const resData = await coderes.json();
    if (resData.emsg != "")
      return {
        message: resData.emsg,
      };

    const rdUrl = new URLSearchParams(resData.RedirectURL.split("?")[1]);
    const code = rdUrl.get("code");
    if (!code) throw Error();
    const response = await fetch(
      "https://authapi.flattrade.in/trade/apitoken",
      {
        method: "POST",
        body: JSON.stringify({
          api_key: account.apiKey,
          request_code: code,
          api_secret: sha256(`${account.apiKey}${code}${account.apiSecret}`),
        }),
      }
    );
    // if (response.status !== 200) throw new Error(await response.json());
    const res = await response.json();
    if (res.stat === "Ok") {
      account.token = res.token;
      account.save();
    } else {
      return {
        message: res.emsg,
      };
    }
  } catch (error) {
    console.log("token generation Error", error);
    return {
      message: "Something went wrong",
    };
  }
  revalidatePath("/", "layout");
}

export async function addNewPosition(prevState: any, formdata: FormData) {
  try {
    // Convert FormData to JSON object
    const data = {
      symbol: formdata.get("symbol")?.toString() || "",
      token: formdata.get("token")?.toString() || "",
      tradeDate: new Date(formdata.get("tradeDate")?.toString() || ""),
      quantity: Number(formdata.get("quantity")) || 0,
      price: Number(formdata.get("price")) || 0,
      bidAmount: Number(formdata.get("bidAmount")) || 0,
      bidOn: Number(formdata.get("bidOn")) || 0,
    };

    const validateFields = NewPositonSchema.safeParse(data);
    if (!validateFields.success) {
      console.error(
        "Validation failed:",
        validateFields.error.flatten().fieldErrors
      );
      return {
        error: validateFields.error.flatten().fieldErrors,
      };
    }

    // Check if user loggen in
    const session: any = await getServerSession(authOptions);
    if (!session) throw new Error("User not loggen in");
    const id = session.user?.id;
    // Connect to the database
    await dbConnect();
    // Check if the position already exists
    const existingPosition: HydratedDocument<IPosition> | null =
      await Position.findOne({ symbol: validateFields.data.symbol });

    if (existingPosition)
      return {
        error: {
          message: "Symbol is exist in your portfolio",
        },
      };

    // new position
    const newPosition: IPosition = await Position.create({
      user: id,
      symbol: validateFields.data.symbol,
      token: validateFields.data.token,
      totalBought: validateFields.data.quantity,
      totalQuantity: validateFields.data.quantity,
      totalProfit: 0,
      totalInvestment: validateFields.data.price * validateFields.data.quantity,
      currentPrice: validateFields.data.price,
      bidAmount: validateFields.data.bidAmount,
      bidOn: validateFields.data.bidOn,
      bidNumber: 1,
    });

    // Create a new transaction
    const newTransaction: ITransaction = await Transaction.create({
      user: id,
      position: newPosition._id,
      tradeType: "buy",
      ...validateFields.data,
    });
  } catch (error) {
    console.error("Error adding new trade:", error);
  }
  // Revalidate the current path
  revalidatePath("/pkj");

  // Revalidate the specific path
  // revalidatePath("/about");
}

export async function makeSip(formState: any, formdata: FormData) {
  try {
    const data = {
      id: formdata.get("id")?.toString() || "",
      symbol: formdata.get("symbol")?.toString() || "",
      token: formdata.get("token")?.toString() || "",
      tradeDate: new Date(formdata.get("tradeDate")?.toString() || ""),
      tradeType: "buy",
      quantity: Number(formdata.get("quantity")) || 0,
      price: Number(formdata.get("price")) || 0,
    };
    const validateFields = TradeSchema.safeParse(data);
    if (!validateFields.success) {
      return {
        error: validateFields.error.flatten().fieldErrors,
      };
    }

    // Check if user loggen in
    const session: any = await getServerSession(authOptions);
    if (!session) throw new Error("User not loggen in");
    const id = session.user?.id;
    // Connect to the database
    await dbConnect();

    const positon = await Position.findById(validateFields.data.id);
    if (!positon) {
      return {
        error: {
          message: "Positon not found",
        },
      };
    }

    positon.totalBought += validateFields.data.quantity;
    positon.totalInvestment +=
      validateFields.data.price * validateFields.data.quantity;
    positon.totalQuantity += validateFields.data.quantity;
    positon.save();

    await Transaction.create({
      user: id,
      position: positon._id,
      ...validateFields.data,
    });
  } catch (error) {
    console.log("Error while making sip", error);
    return {
      error: {
        message: "Something went wrong in sip",
      },
    };
  }
  revalidatePath("/pkj");
}

export async function makeBid(formState: any, formdata: FormData) {
  try {
    const data = {
      id: formdata.get("id")?.toString() || "",
      symbol: formdata.get("symbol")?.toString() || "",
      token: formdata.get("token")?.toString() || "",
      tradeDate: new Date(formdata.get("tradeDate")?.toString() || ""),
      tradeType: "buy",
      quantity: Number(formdata.get("quantity")) || 0,
      price: Number(formdata.get("price")) || 0,
      isBid: true,
    };
    const validateFields = TradeSchema.safeParse(data);
    if (!validateFields.success) {
      return {
        error: validateFields.error.flatten().fieldErrors,
      };
    }

    // Check if user loggen in
    const session: any = await getServerSession(authOptions);
    if (!session) throw new Error("User not loggen in");
    const id = session.user?.id;
    // Connect to the database
    await dbConnect();

    const positon = await Position.findById(validateFields.data.id);
    if (!positon) {
      return {
        error: {
          message: "Positon not found",
        },
      };
    }

    positon.totalBought += validateFields.data.quantity;
    positon.totalInvestment +=
      validateFields.data.price * validateFields.data.quantity;
    positon.totalQuantity += validateFields.data.quantity;
    positon.bidNumber += 1;
    positon.save();

    await Transaction.create({
      user: id,
      position: positon._id,
      ...validateFields.data,
    });
  } catch (error) {
    console.log("Error while making Bid", error);
    return {
      error: {
        message: "Something went wrong ",
      },
    };
  }
  revalidatePath("/pkj");
}

export async function bookProfit(formState: any, formdata: FormData) {
  try {
    const data = {
      id: formdata.get("id")?.toString() || "",
      symbol: formdata.get("symbol")?.toString() || "",
      token: formdata.get("token")?.toString() || "",
      tradeDate: new Date(formdata.get("tradeDate")?.toString() || ""),
      tradeType: "sell",
      quantity: Number(formdata.get("quantity")) || 0,
      price: Number(formdata.get("price")) || 0,
    };
    const validateFields = TradeSchema.safeParse(data);
    if (!validateFields.success) {
      return {
        error: validateFields.error.flatten().fieldErrors,
      };
    }

    // Check if user loggen in
    const session: any = await getServerSession(authOptions);
    if (!session) throw new Error("User not loggen in");
    const id = session.user?.id;
    // Connect to the database
    await dbConnect();

    const positon = await Position.findById(validateFields.data.id);
    if (!positon) {
      return {
        error: {
          message: "Positon not found",
        },
      };
    }

    positon.totalSold += validateFields.data.quantity;
    positon.totalProfit +=
      validateFields.data.price * validateFields.data.quantity;
    positon.totalQuantity -= validateFields.data.quantity;
    positon.bidNumber = 1;
    positon.save();

    await Transaction.create({
      user: id,
      position: positon._id,
      ...validateFields.data,
    });
  } catch (error) {
    console.log("Error while Booking profit", error);
    return {
      error: {
        message: "Something went wrong",
      },
    };
  }
  revalidatePath("/pkj");
}

export async function deletePosition(formState: any, formdata: FormData) {
  try {
    const id = formdata.get("id")?.toString() || "";
    if (id === "") return { error: "Someting missing" };
    await dbConnect();
    await Position.findByIdAndDelete(id);
  } catch (error) {
    console.log("Deleting Position error", error);
    return { error: "Someting went wrong" };
  }
  revalidatePath("/pkj");
}

export async function getPositions() {
  const session: any = await getServerSession(authOptions);
  const user: string = session?.user.id;
  try {
    await dbConnect();

    const positions: HydratedDocument<IPosition>[] = await Position.aggregate([
      {
        $match: {
          user: new Types.ObjectId(user),
        },
      },
      {
        $project: {
          _id: {
            $toString: "$_id",
          },
          user: {
            $toString: "$user",
          },
          symbol: 1,
          token: 1,
          totalBought: 1,
          totalSold: 1,
          totalQuantity: 1,
          totalProfit: 1,
          totalInvestment: 1,
          currentPrice: 1,
          bidAmount: 1,
          bidOn: 1,
          bidNumber: 1,
        },
      },
    ]);
    return positions;
  } catch (error) {
    console.error("Error fetching positions:", error);
    return [];
  }
}

export async function getTatansaction(id: string) {
  dbConnect();
  const transactions = await Transaction.aggregate([
    {
      $match: {
        position: new Types.ObjectId(id),
      },
    },
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        user: {
          $toString: "$user",
        },
        symbol: 1,
        quantity: 1,
        price: 1,
        tradeType: 1,
        tradeDate: 1,
        isBid: 1,
        position: {
          $toString: "$position",
        },
      },
    },
  ]);
  return transactions;
}

export async function updatePrice(account: IAccount, positions: IPosition[]) {
  async function processArray(account: IAccount, positions: IPosition[]) {
    for (const position of positions) {
      const quote = await getQuote(
        position.token,
        account.userId,
        account.token!
      );

      const r = await Position.findByIdAndUpdate(
        position._id,
        {
          currentPrice: quote.lp,
        },
        { new: true }
      );
    }
  }
  await processArray(account, positions);
  revalidatePath("pkj");
}
