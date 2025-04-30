import { getAccount } from "@/app/actions";
import EditAccountForm from "@/components/account/EditAccountForm";
import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/signin");
  }
  const account = await getAccount();

  if (!account) {
    redirect("/");
  }
  return (
    <div className="max-w-96 m-auto  border-2 p-4 rounded-lg mt-4">
      <div className="relative flex justify-center items-center my-4">
        <h2 className="text-2xl">Edit A/c ({account.userId})</h2>
      </div>
      <EditAccountForm account={account} id={account._id!} />
    </div>
  );
}
