import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAccount } from "../actions";
import BuyForm from "@/components/lifo/buyform";
import { getLifoPosition } from "../lifo-action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LifoBuyColumn } from "@/components/lifo/lifobuyColumn";
import { PositionDataTable } from "@/components/data-table";
import { LifoSellColumn } from "@/components/lifo/lifosellColumn";

export default async function LifoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const account = await getAccount();
  if (!account) redirect("/account/add");
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

  const lifoPosition = await getLifoPosition();
  const lifoOpenPositions = lifoPosition.filter((p) => !p.sellDate);
  const lifoClosedPositions = lifoPosition.filter((p) => p.sellDate);

  return (
    <div className="container mx-auto space-y-4">
      <h2 className="text-2xl">ETF Shop</h2>
      <BuyForm account={account} />
      <Tabs defaultValue="openposition">
        <TabsList>
          <TabsTrigger value="openposition">Kharida Hua Maal</TabsTrigger>
          <TabsTrigger value="closedposition">Bika Hua Maal</TabsTrigger>
        </TabsList>
        <TabsContent value="openposition">
          <Card>
            <CardHeader className="absolute w-72">
              <CardTitle>Kharida Hua Maal</CardTitle>
              <CardDescription className="sr-only">
                List of hold items
              </CardDescription>
              {/* <RefreshButton account={account} positions={positions} /> */}
            </CardHeader>
            <CardContent>
              <PositionDataTable
                columns={LifoBuyColumn}
                data={lifoOpenPositions}
                showColumnVisibility={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        {/* Sell positons tab */}
        <TabsContent value="closedposition">
          <Card>
            <CardHeader className="absolute w-72">
              <CardTitle>Bika Hua Maal</CardTitle>
              <CardDescription className="sr-only">
                List of sold items
              </CardDescription>
              {/* <RefreshButton account={account} positions={positions} /> */}
            </CardHeader>
            <CardContent>
              <PositionDataTable
                columns={LifoSellColumn}
                data={lifoClosedPositions}
                showColumnVisibility={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
