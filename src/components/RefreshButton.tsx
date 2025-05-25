"use client";
import React, { useState } from "react";
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
  const [working, setWorking] = useState(false);
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={async () => {
        setWorking(true);
        await updatePrice(account, positions);
        setWorking(false);
      }}
      disabled={working}
      className="absolute right-8 top-0"
    >
      <RefreshCcw className={working ? "animate-spin" : ""} />
    </Button>
  );
};

export default RefreshButton;
