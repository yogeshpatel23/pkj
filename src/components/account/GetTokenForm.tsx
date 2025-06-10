"use client";
import React, { useActionState } from "react";
import { getToken } from "@/app/actions";
import { Button } from "../ui/button";
// import { useToast } from "../ui/use-toast";

const initialState = {
  message: "",
};

const GetTokenForm = ({ id }: { id: string }) => {
  const [formState, formAction, pending] = useActionState(
    getToken,
    initialState
  );
  return (
    <form action={formAction} className="flex flex-col">
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="link"
        className="p-0 h-4"
        size="sm"
        disabled={pending}
      >
        {pending ? "Generating..." : "Generate Token"}
      </Button>
      <span className="text-[8px] text-red-500">{formState?.message}</span>
    </form>
  );
};

export default GetTokenForm;
