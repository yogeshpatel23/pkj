"use client";

import { format } from "date-fns";

import { ITransaction } from "@/models/Transaction.model";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

export const transactionColounm: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "tradeDate",
    header: "Date",
    cell: ({ row }) => {
      const date = format(row.getValue("tradeDate"), "PP");
      return <div className="text-left font-medium">{date}</div>;
    },
  },
  {
    accessorKey: "tradeType",
    header: () => <div className="text-center">Buy/Sell</div>,
    cell: ({ row }) => {
      const side = row.getValue("tradeType");
      if (side === "buy") {
        return (
          <div className="flex justify-center">
            <ArrowBigUp color="red" />
          </div>
        );
      } else {
        return (
          <div className="flex justify-center">
            <ArrowBigDown color="green" />
          </div>
        );
      }
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const ltp = parseFloat(row.getValue("price")).toFixed(2);

      return <div className="text-right font-medium">{ltp}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Qty</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "Amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const prc = parseFloat(row.getValue("price"));
      const qty = parseFloat(row.getValue("quantity"));
      const amount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(prc * qty);
      return <div className="text-right font-medium">{amount}</div>;
    },
  },
];
