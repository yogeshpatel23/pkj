"use client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { addAccount } from "@/app/actions";
// import { useToast } from "../ui/use-toast";
import { useActionState, useEffect } from "react";

const initialstate: { errors: any } = {
  errors: {},
};

const AddAccountForm = () => {
  const [formState, formAction, pending] = useActionState(
    addAccount,
    initialstate
  );
  //   const { toast } = useToast();

  useEffect(() => {
    if (formState.errors.message) {
      //   toast({
      //     variant: "destructive",
      //     title: "Error",
      //     description: formState.errors.message,
      //   });
    }
  }, [formState.errors]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label className="mb-2" htmlFor="userId">
          User Id
        </Label>
        <Input id="userId" name="userId" placeholder="User Id" />
        <span className="text-red-500 text-xs">
          {formState?.errors?.userId?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="password">
          Passwrod
        </Label>
        <Input id="password" name="password" placeholder="Passwrod" />
        <span className="text-red-500 text-xs">
          {formState?.errors?.password?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="totpcode">
          TOTP Code
        </Label>
        <Input id="totpcode" name="totpCode" placeholder="TOTP Code" />
        <span className="text-red-500 text-xs">
          {formState?.errors?.totpCode?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="key">
          Key
        </Label>
        <Input id="key" name="apiKey" placeholder="Key provide by Broker" />
        <span className="text-red-500 text-xs">
          {formState?.errors?.apiKey?.[0]}
        </span>
      </div>
      <div>
        <Label className="mb-2" htmlFor="secret">
          Secret
        </Label>
        <Input id="secret" name="apiSecret" placeholder="secter / <userid>_U" />
        <span className="text-red-500 text-xs">
          {formState?.errors?.apiSecret?.[0]}
        </span>
      </div>
      <div className="text-right">
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Adding..." : "Add"}
        </Button>
        <span className="text-red-500 text-sm">
          {formState?.errors.message}
        </span>
      </div>
    </form>
  );
};

export default AddAccountForm;
