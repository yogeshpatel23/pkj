"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { updatePrice } from "@/app/actions";
import { RefreshCcw } from "lucide-react";
import { IAccount } from "@/models/Account.model";
import { IPosition } from "@/models/Position.model";

const RefreshButton = ({
  account,
  positions,
}: {
  account: IAccount;
  positions: IPosition[];
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => updatePrice(account, positions)}
      className="absolute right-8 top-0"
    >
      <RefreshCcw />
    </Button>
  );
};

export default RefreshButton;
