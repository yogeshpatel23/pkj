import { redirect } from "next/navigation";
import { getAccount } from "./actions";

export default async function Home() {
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
  return (
    <div>
      <h1>dashbord</h1>
    </div>
  );
}
