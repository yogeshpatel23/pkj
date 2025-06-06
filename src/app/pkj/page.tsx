import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAccount, getPositions } from "../actions";
import { PositionDataTable } from "@/components/data-table";
import { positionColumns } from "@/components/positions/PositionColumn";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NewTrade from "@/components/transaction/new-trade";
import RefreshButton from "@/components/RefreshButton";

export default async function PaisoKaJangle() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const account = await getAccount();
  if (!account) redirect("/account/add");

  // Get Positons and update fields
  const positions = await getPositions();
  const data = positions?.map((position) => ({
    ...position,
    currentMarketValue: position.currentPrice * position.totalQuantity,
    avgPrice: position.totalInvestment / position.totalQuantity,
    notionalpl:
      position.currentPrice * position.totalQuantity - position.totalInvestment,
    nextbidprice:
      (position.totalInvestment -
        position.totalInvestment *
          ((position.bidOn / 100) * position.bidNumber)) /
      position.totalQuantity,
    bidQty: Math.round(
      (position.bidAmount * position.bidNumber) / position.currentPrice
    ),
    isbidToday:
      (position.totalInvestment -
        position.totalInvestment *
          ((position.bidOn / 100) * position.bidNumber)) /
        position.totalQuantity >
      position.currentPrice,
  }));

  if (
    account?.token === "" ||
    account?.tokenExp !== new Date().toDateString()
  ) {
    return (
      <p>
        <code>Token Expired. Please Genenrate new.</code>{" "}
      </p>
    );
  }

  return (
    <div className="container mx-auto">
      <NewTrade account={account} />
      <Card className="relative">
        <CardHeader className="absolute">
          <CardTitle>Portfolio</CardTitle>
          <CardDescription className="sr-only">
            Here you can manage your Portfolio
          </CardDescription>
        </CardHeader>
        <RefreshButton account={account} positions={positions} />
        <CardContent>
          <PositionDataTable
            columns={positionColumns}
            data={data}
            showColumnVisibility={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
