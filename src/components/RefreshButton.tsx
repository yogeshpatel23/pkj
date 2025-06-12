"use client";
import React, { useEffect, useState } from "react";
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
  async function handlePriceaUpdate() {
    setWorking(true);
    await updatePrice(account, positions);
    setWorking(false);
  }
  useEffect(() => {
    const timer = setInterval(async () => {
      await handlePriceaUpdate();
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handlePriceaUpdate}
      disabled={working}
      className="absolute right-8 top-6"
    >
      <RefreshCcw className={working ? "animate-spin" : ""} />
    </Button>
  );
};

export default RefreshButton;
