"use client";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addNewPosition } from "@/app/actions";
import { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { IAccount } from "@/models/Account.model";
import { searchSymbol } from "@/lib/flattrate";

const initialState: { error: any } = {
  error: {},
};

export default function NewTrade({ account }: { account: IAccount }) {
  const [formState, formAction, pending] = useActionState(
    addNewPosition,
    initialState
  );
  const [date, setDate] = useState<Date>();
  const [token, setToken] = useState("");
  const [symbol, setSymbol] = useState<string>("");
  const [symbolList, setSymbolList] = useState<any[]>([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (formState?.error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: formState.errors.message,
      // });
      console.log(formState);
    }
  }, [formState?.error]);

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
    <Dialog>
      <DialogTrigger className="mb-4" asChild>
        <Button variant="outline">New Position</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Position</DialogTitle>
          <DialogDescription>
            Add a new position to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="w-96 mx-auto space-y-4">
          <div className="relative">
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
            <Label className="mb-2" htmlFor="bidAmount">
              BID Amount
            </Label>
            <Input name="bidAmount" defaultValue="2000" required />
            <span className="text-red-500 text-sm">
              {formState?.error.bidAmount?.[0]}
            </span>
          </div>
          <div>
            <Label className="mb-2" htmlFor="bidOn">
              BID On
            </Label>
            <Input name="bidOn" defaultValue="10" required />
            <span className="text-red-500 text-sm">
              {formState?.error.bidOn?.[0]}
            </span>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding..." : "Add Position"}
            </Button>
            <span className="text-red-500 text-sm">
              {formState?.error.message}
            </span>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
