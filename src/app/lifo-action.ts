"use server";

import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import LifoPosition, { ILifoPosition } from "@/models/LifoPosition.model";
import { LifoPositionSchema } from "@/schema/lifoBuySchema";
import { HydratedDocument, Types } from "mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function addLifoPositon(prevSate: any, formdata: FormData) {
  try {
    const data = {
      symbol: formdata.get("symbol")?.toString() || "",
      token: formdata.get("token")?.toString() || "",
      buyDate: new Date(formdata.get("date")?.toString() || ""),
      quantity: Number(formdata.get("quantity")) || 0,
      buyPrice: Number(formdata.get("price")) || 0,
      investedAmount: Number(formdata.get("invAmt")) || 0,
    };

    const validateFields = LifoPositionSchema.safeParse(data);
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
    const newPosition = await LifoPosition.create({
      user: id,
      fundedAmount:
        validateFields.data.quantity * validateFields.data.buyPrice -
        validateFields.data.investedAmount,
      ...validateFields.data,
      cmp: validateFields.data.buyPrice,
    });
    console.log(newPosition);
  } catch (error) {
    console.error("Error adding new lifo buy:", error);
    return {
      error: {
        message: "Someting went wrong on adding positons",
      },
    };
  }
  revalidatePath("/lifo");
}

export async function getLifoPosition() {
  const session: any = await getServerSession(authOptions);
  const user: string = session?.user.id;
  try {
    await dbConnect();
    const lifoPosition: HydratedDocument<ILifoPosition>[] =
      await LifoPosition.aggregate([
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
            buyDate: 1,
            quantity: 1,
            buyPrice: 1,
            investedAmount: 1,
            fundedAmount: 1,
            sellDate: 1,
            sellPrice: 1,
            cmp: 1,
          },
        },
      ]);
    return lifoPosition;
  } catch (error) {
    console.error("Error fetching lifopositions:", error);
    return [];
  }
}

export async function deleteLifoPosition(formState: any, formdata: FormData) {
  try {
    const id = formdata.get("id")?.toString() || "";
    if (id === "") return { error: "Someting missing" };
    await dbConnect();
    await LifoPosition.findByIdAndDelete(id);
  } catch (error) {
    console.log("Deleting Position error", error);
    return { error: "Someting went wrong" };
  }
  revalidatePath("/lifo");
}
