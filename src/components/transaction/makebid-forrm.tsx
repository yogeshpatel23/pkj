"use client";

import { makeBid } from "@/app/actions";
import React, { useActionState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { IPosition } from "@/models/Position.model";
import { Button } from "../ui/button";

const initialState: { error: any } = {
  error: {},
};

const MakeBidForm = ({ position }: { position: IPosition }) => {
  const [formState, formAction, pending] = useActionState(
    makeBid,
    initialState
  );

  return (
    <form action={formAction} className="w-96 mx-auto space-y-4">
      <input type="hidden" name="id" value={position._id} />
      <div className="relative">
        <Label className="mb-2" htmlFor="symbol">
          Symbol
        </Label>
        <Input name="symbol" readOnly value={position.symbol} />
        <input type="hidden" name="token" value={position.token} />
        <span className="text-red-500 text-sm">
          {formState?.error.symbol?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="tradeDate">
          Trade Date
        </Label>
        <Input
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          name="tradeDate"
          required
        />
        <span className="text-red-500 text-sm">
          {formState?.error.tradeDate?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="quantity">
          Quantity
        </Label>
        <Input name="quantity" type="number" required />
        <span className="text-red-500 text-sm">
          {formState?.error.quantity?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="price">
          Price
        </Label>
        <Input name="price" required />
        <span className="text-red-500 text-sm">
          {formState?.error.price?.[0]}
        </span>
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "working..." : "BID now"}
        </Button>
        <span className="text-red-500 text-sm">{formState?.error.message}</span>
      </div>
    </form>
  );
};

export default MakeBidForm;
