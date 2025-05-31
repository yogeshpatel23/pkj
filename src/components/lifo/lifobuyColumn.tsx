"use client";

import { differenceInDays, format } from "date-fns";
import { ILifoPosition } from "@/models/LifoPosition.model";
import { ColumnDef } from "@tanstack/react-table";
import DeleteLifoPosition from "./delete-lifo-position";

export const LifoBuyColumn: ColumnDef<ILifoPosition>[] = [
  {
    accessorKey: "symbol",
    header: () => <div className="text-wrap">Symbol</div>,
  },
  {
    accessorKey: "buyDate",
    header: () => <div className="text-wrap">Buy Date</div>,
    cell: ({ row }) => {
      const date = format(row.getValue("buyDate"), "PP");
      return <div className="text-left font-medium">{date}</div>;
    },
  },
  {
    accessorKey: "buyPrice",
    header: () => <div className="text-right text-wrap">Buy Price</div>,
    cell: ({ row }) => {
      const bprice = parseFloat(row.getValue("buyPrice"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(bprice);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right text-wrap">Quantity</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("quantity")}</div>
      );
    },
  },
  {
    accessorKey: "investedAmount",
    header: () => <div className="text-right text-wrap">Invested Amount</div>,
    cell: ({ row }) => {
      const bprice = parseFloat(row.getValue("investedAmount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(bprice);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "fundedAmount",
    header: () => <div className="text-right text-wrap">Funded Amount</div>,
    cell: ({ row }) => {
      const bprice = parseFloat(row.getValue("fundedAmount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(bprice);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "cmp",
    header: () => <div className="text-right text-wrap">CMP</div>,
    cell: ({ row }) => {
      const ltp = parseFloat(row.getValue("cmp")).toFixed(2);
      return <div className="text-right font-medium">{ltp}</div>;
    },
  },
  {
    accessorKey: "sellDate",
    header: () => <div className="text-wrap">Sell Date</div>,
    cell: ({ row }) => {
      if (row.getValue("sellDate")) {
        const date = format(row.getValue("sellDate"), "PP");
        return <div className="text-left font-medium">{date}</div>;
      }
      return <div className="font-medium"> - </div>;
    },
  },
  {
    accessorKey: "sellPrice",
    header: () => <div className="text-right text-wrap">Sell Price</div>,
    cell: ({ row }) => {
      const bprice = parseFloat(row.getValue("sellPrice"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(bprice);
      return isNaN(bprice) ? (
        <div className="text-right font-medium"> - </div>
      ) : (
        <div className="text-right font-medium">{formatted}</div>
      );
    },
  },
  {
    id: "tgtprc",
    header: () => <div className="text-right">Target Price</div>,
    cell: ({ row }) => {
      const buyPrice = parseFloat(row.getValue("buyPrice"));
      const tgtprc = buyPrice + buyPrice * 0.06;
      return <div className="text-right font-medium">{tgtprc.toFixed(2)}</div>;
    },
  },
  {
    id: "holdingday",
    header: () => <div className="text-right">Holding Days</div>,
    cell: ({ row }) => {
      const days = differenceInDays(new Date(), row.getValue("buyDate"));
      return <div className="text-right font-medium">{days}</div>;
    },
  },
  {
    id: "intrestamt",
    header: () => <div className="text-right">Intrest Amount</div>,
    cell: ({ row }) => {
      const days = differenceInDays(new Date(), row.getValue("buyDate"));
      const inta =
        days === 0
          ? 0
          : ((parseFloat(row.getValue("fundedAmount")) * 0.16) / 365) * days;
      return <div className="text-right font-medium">{inta.toFixed(2)}</div>;
    },
  },
  {
    id: "delete",
    enableHiding: false,
    cell: ({ row }) => {
      const position = row.original;
      return <DeleteLifoPosition id={position._id!} />;
    },
  },
];
