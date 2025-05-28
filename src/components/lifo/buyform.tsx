"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useActionState, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { searchSymbol } from "@/lib/flattrate";
import { IAccount } from "@/models/Account.model";
import { addLifoPositon } from "@/app/lifo-action";

const initialState: { error: any } = {
  error: {},
};

const BuyForm = ({ account }: { account: IAccount }) => {
  const [formState, formAction, pending] = useActionState(
    addLifoPositon,
    initialState
  );

  const [token, setToken] = useState("");
  const [symbol, setSymbol] = useState<string>("");
  const [symbolList, setSymbolList] = useState<any[]>([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (symbol.length < 3) return;
    if (selected) return;
    const timeOut = setTimeout(async () => {
      const data = await searchSymbol(symbol, account.userId, account.token!);
      if (data.stat === "Ok") {
        setSymbolList(data.values);
      }
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [symbol]);

  return (
    <form
      action={formAction}
      className="flex items-center gap-4 border px-4 py-2 rounded-2xl"
    >
      <div className="relative w-72">
        <Label className="mb-2" htmlFor="symbol">
          Symbol
        </Label>
        <Input
          name="symbol"
          placeholder="eg. RELIANCE"
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value.toUpperCase());
            setSelected(false);
          }}
          required
        />
        <input type="hidden" name="token" value={token} />
        <span className="text-red-500 text-sm">
          {formState?.error.symbol?.[0]}
        </span>
        {/* suggention box */}
        {symbolList.length > 0 && (
          <div className="absolute w-full  h-30 z-10 border bg-gray-600 rounded-lg overflow-y-scroll top-15">
            {symbolList.map((sym) => (
              <div
                className="px-4 cursor-pointer hover:bg-gray-800"
                key={sym.token}
                onClick={() => {
                  setSymbol(sym.tsym);
                  setToken(sym.token);
                  setSelected(true);
                  setSymbolList([]);
                }}
              >
                {sym.tsym}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <Label className="mb-2" htmlFor="date">
          Date
        </Label>
        <Input
          type="date"
          id="date"
          name="date"
          defaultValue={new Date().toISOString().split("T")[0]}
        />
        <span className="text-red-500 text-sm">
          {formState?.error.buyDate?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="quantity">
          Quantity
        </Label>
        <Input name="quantity" id="quantity" required />
        <span className="text-red-500 text-sm">
          {formState?.error.quantity?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="price">
          Price
        </Label>
        <Input name="price" id="price" required />
        <span className="text-red-500 text-sm">
          {formState?.error.buyPrice?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="invAmt">
          Invested Amount
        </Label>
        <Input name="invAmt" id="invAmt" required />
        <span className="text-red-500 text-sm">
          {formState?.error.investedAmount?.[0]}
        </span>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add Position"}
      </Button>
      <span className="text-red-500 text-sm">{formState?.error.message}</span>
    </form>
  );
};

export default BuyForm;
