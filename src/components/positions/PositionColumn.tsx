"use client";

import { IPosition } from "@/models/Position.model";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import SipForm from "../transaction/sip-form";
import BookProfit from "../transaction/bookProfit";
import MakeBidForm from "../transaction/makebid-forrm";
import { TransactionList } from "../transaction/transactionList";
import DeletePositionForm from "./delete-position-form";

export interface IPositionColumn extends IPosition {
  avgPrice: number;
  currentMarketValue: number;
  notionalpl: number;
  nextbidprice: number;
  bidQty: number;
  isbidToday: boolean;
}

export const positionColumns: ColumnDef<IPositionColumn>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "totalBought",
    header: () => <div className="text-right text-wrap">Total Bought</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.getValue("totalBought")}
      </div>
    ),
  },
  {
    accessorKey: "totalSold",
    header: () => <div className="text-right  text-wrap">Total Sold</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.getValue("totalSold")}</div>
    ),
  },
  {
    accessorKey: "totalInvestment",
    header: () => <div className="text-right  text-wrap">Total Investment</div>,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("totalInvestment"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(profit);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalProfit",
    header: () => <div className="text-right text-wrap">Booked Profit</div>,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("totalProfit"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(profit);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalQuantity",
    header: () => <div className="text-right text-wrap">Holding</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.getValue("totalQuantity")}
      </div>
    ),
  },
  {
    accessorKey: "avgPrice",
    header: () => <div className="text-right text-wrap">Avrage Price</div>,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("avgPrice"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(profit);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "currentPrice",
    header: () => <div className="text-right">CMP</div>,
    cell: ({ row }) => {
      const ltp = parseFloat(row.getValue("currentPrice")).toFixed(2);

      return <div className="text-right font-medium">{ltp}</div>;
    },
  },
  {
    accessorKey: "currentMarketValue",
    header: () => (
      <div className="text-right text-wrap">Current Market Value</div>
    ),
    cell: ({ row }) => {
      const ltp = parseFloat(row.getValue("currentMarketValue")).toFixed(2);

      return <div className="text-right font-medium">{ltp}</div>;
    },
  },
  {
    accessorKey: "notionalpl",
    header: () => <div className="text-right text-wrap">Notional Profit</div>,
    cell: ({ row }) => {
      const ltp = parseFloat(row.getValue("notionalpl")).toFixed(2);

      return <div className="text-right font-medium">{ltp}</div>;
    },
  },
  {
    accessorKey: "nextbidprice",
    header: () => <div className="text-right text-wrap">Next Bid Price</div>,
    cell: ({ row }) => {
      const ltp = parseFloat(row.getValue("nextbidprice")).toFixed(2);

      return <div className="text-right font-medium">{ltp}</div>;
    },
  },
  {
    accessorKey: "bidQty",
    header: () => <div className="text-right">BID Qty</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.getValue("bidQty")}</div>
    ),
  },
  {
    accessorKey: "isbidToday",
    header: () => <div className="text-right">BID Today</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.getValue("isbidToday") ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="cursor-pointer" variant="ghost">
                Make Bid
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make BID</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <MakeBidForm position={row.original} />
            </DialogContent>
          </Dialog>
        ) : (
          ""
        )}
      </div>
    ),
  },
  {
    accessorKey: "bidNumber",
    header: () => <div className="text-right">BID</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.getValue("bidNumber")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const position = row.original;
      const [isSipOpen, setIsSipOpen] = useState(false);
      const [isProfitOpen, setIsProfitOpen] = useState(false);
      const [istransOpen, setIsTransOpen] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="size-4 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsSipOpen(true)}>
                Make SIP
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfitOpen(true)}>
                Book Profit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsTransOpen(true)}>
                View Transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isSipOpen} onOpenChange={setIsSipOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make SIP</DialogTitle>
                <DialogDescription>Make SIP to your Position</DialogDescription>
              </DialogHeader>
              <SipForm position={position} />
            </DialogContent>
          </Dialog>
          <Dialog open={isProfitOpen} onOpenChange={setIsProfitOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book Profit</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <BookProfit position={position} />
            </DialogContent>
          </Dialog>
          <Dialog open={istransOpen} onOpenChange={setIsTransOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transactions</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <TransactionList id={position._id!} />
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
  {
    id: 'delete',
    cell: ({row}) => {
      const position = row.original;
      return <DeletePositionForm id={position._id!} />
    }
  }
];
