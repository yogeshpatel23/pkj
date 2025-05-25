"use client";
import { useActionState } from "react";
import { Button } from "../ui/button";
import { HourglassIcon, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteLifoPosition } from "@/app/lifo-action";

const initialState = {
  error: "",
};
const DeleteLifoPosition = ({ id }: { id: string }) => {
  const [formState, formAction, pending] = useActionState(
    deleteLifoPosition,
    initialState
  );
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" type="button" disabled={pending} size="icon">
          {pending ? (
            <HourglassIcon className="animate-spin" />
          ) : (
            <Trash2Icon />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            position.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <AlertDialogAction className="bg-red-600 text-white" type="submit">
              Delete
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLifoPosition;
