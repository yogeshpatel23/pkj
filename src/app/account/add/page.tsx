import AddAccountForm from "@/components/account/AddAccountForm";
import { getAccount } from "@/app/actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AddAccount() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/signin");
  }
  const account = await getAccount();
  if (account) redirect("/");

  return (
    <div className="max-w-96 m-auto border-2 p-4 rounded-lg mt-4">
      <div className="relative flex justify-center items-center my-4">
        <h2 className="text-2xl">Add Account</h2>
      </div>
      <AddAccountForm />
    </div>
  );
}
