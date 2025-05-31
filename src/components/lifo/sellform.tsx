"use client";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { ILifoPosition } from "@/models/LifoPosition.model";
import { sellLifoPosition } from "@/app/lifo-action";
import { Hourglass } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
const initSatate = {
  stat: "",
  message: "",
};
const LifoSellForm = ({ position }: { position: ILifoPosition }) => {
  const [formState, formAction, pending] = useActionState(
    sellLifoPosition,
    initSatate
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={pending}
          size="sm"
          variant="outline"
          className="cursor-pointer"
        >
          {pending ? <Hourglass /> : "Sell"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell {position.symbol}</DialogTitle>
          <DialogDescription className="sr-only">
            Sell {position.symbol}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={position._id} />
          <div>
            <Label htmlFor="selldate" className="mb-2">
              Sell Date
            </Label>
            <Input
              type="date"
              id="selldate"
              defaultValue={new Date().toISOString().split("T")[0]}
              name="sellDate"
              required
            />
          </div>
          <div>
            <Label htmlFor="sellprice" className="mb-2">
              Sell Price
            </Label>
            <Input
              id="sellprice"
              defaultValue={position.cmp}
              name="sellPrice"
              required
            />
          </div>
          <Button disabled={pending} variant="destructive">
            {pending ? <Hourglass /> : "Sell"}
          </Button>
        </form>
        <p
          className={`${
            formState?.stat === "ok" ? "text-green-600" : "text-red-500"
          }`}
        >
          {formState?.message}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LifoSellForm;
