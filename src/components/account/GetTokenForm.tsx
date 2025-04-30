"use client";
import React, { useActionState, useEffect } from "react";
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
  //   const { toast } = useToast();
  useEffect(() => {
    console.log(formState);
    if (formState?.message && formState?.message != "") {
      //   toast({
      //     variant: "destructive",
      //     title: "Error",
      //     description: formState?.message,
      //   });
    }
    if (formState) {
      formState.message = "";
    }
  }, [formState?.message]);
  return (
    <form action={formAction}>
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
    </form>
  );
};

export default GetTokenForm;
