"use client";

import { format } from "date-fns";

import { makeSip } from "@/app/actions";
import React, { useActionState, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IPosition } from "@/models/Position.model";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const initialState: { error: any } = {
  error: {},
};

const SipForm = ({ position }: { position: IPosition }) => {
  const [formState, formAction, pending] = useActionState(
    makeSip,
    initialState
  );
  const [date, setDate] = useState<Date>();
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
        <input
          type="hidden"
          name="tradeDate"
          value={date ? date.toDateString() : ""}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {date ? format(date, "dd/MM/yyyy") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              required
            />
          </PopoverContent>
        </Popover>
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
          {pending ? "Adding..." : "Make SIP"}
        </Button>
        <span className="text-red-500 text-sm">{formState?.error.message}</span>
      </div>
    </form>
  );
};

export default SipForm;
