"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { IAccount } from "@/models/Account.model";
import { ILifoPosition } from "@/models/LifoPosition.model";
import { updateLifoPrice } from "@/app/lifo-action";

const LifoRefreshButton = ({
  account,
  positions,
}: {
  account: IAccount;
  positions: ILifoPosition[];
}) => {
  const [working, setWorking] = useState(false);
  async function handlePriceaUpdate() {
    setWorking(true);
    await updateLifoPrice(account, positions);
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

export default LifoRefreshButton;
