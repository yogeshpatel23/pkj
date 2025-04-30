"use client";
import { IAccount } from "@/models/Account.model";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { editAccount } from "@/app/actions";
import { useActionState } from "react";
import { Button } from "../ui/button";

const initialstate: { errors: any } = {
  errors: {},
};

const EditAccountForm = ({
  account,
  id,
}: {
  account: IAccount;
  id: string;
}) => {
  const [formState, formAction, pending] = useActionState(
    editAccount,
    initialstate
  );
  return (
    <form action={formAction} className="space-y-4">
      <Input type="hidden" name="userId" value={account.userId} />
      <Input type="hidden" name="id" value={id} />
      <div>
        <Label className="mb-2" htmlFor="password">
          Passwrod
        </Label>
        <Input
          id="password"
          name="password"
          defaultValue={account.password}
          placeholder="Passwrod"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.password?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="totpcode">
          TOTP Code
        </Label>
        <Input
          id="totpcode"
          name="totpCode"
          defaultValue={account.totpCode}
          placeholder="TOTP Code"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.totpCode?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="key">
          Key
        </Label>
        <Input
          id="key"
          name="apiKey"
          defaultValue={account.apiKey}
          placeholder="Key provide by Broker"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.apiKey?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="secret">
          Secret
        </Label>
        <Input
          id="secret"
          name="apiSecret"
          defaultValue={account.apiSecret}
          placeholder="secter / <userid>_U"
        />
        <span className="text-red-500 text-sm">
          {formState?.errors?.apiSecret?.[0]}
        </span>
      </div>
      <div className="text-right">
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Updating..." : "Update"}
        </Button>
        <span className="text-red-500 text-sm">
          {formState?.errors.message}
        </span>
      </div>
    </form>
  );
};

export default EditAccountForm;
