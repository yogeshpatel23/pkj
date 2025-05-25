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
import { LifoBuyColumn } from "@/components/lifo/lifobuyColumn";
import { PositionDataTable } from "@/components/data-table";

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

  return (
    <div className="container mx-auto">
      <BuyForm account={account} />
      <Card>
        <CardHeader className="absolute w-72">
          <CardTitle>Lifo Insvstment</CardTitle>
          <CardDescription className="sr-only">
            Here you can manage your Portfolio
          </CardDescription>
          {/* <RefreshButton account={account} positions={positions} /> */}
        </CardHeader>
        <CardContent>
          <PositionDataTable
            columns={LifoBuyColumn}
            data={lifoPosition}
            showColumnVisibility={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
