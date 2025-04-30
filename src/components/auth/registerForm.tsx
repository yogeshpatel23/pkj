"use client";

import React, { useActionState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { registerUser } from "@/app/actions";
import { Button } from "../ui/button";

const initialState: { error: any } = {
  error: {},
};

const RegisterForm = () => {
  const [formState, formAction, pending] = useActionState(
    registerUser,
    initialState
  );
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          name="name"
          required
          placeholder="Enter Your Name"
        />
        <span className="text-red-500 text-sm">
          {formState?.error.name?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          required
          placeholder="Enter Your email"
        />
        <span className="text-red-500 text-sm">
          {formState?.error.email?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="password" className="mb-2">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          name="password"
          required
          placeholder="Make it secure"
        />
        <span className="text-red-500 text-sm">
          {formState?.error.password?.[0]}
        </span>
      </div>
      <div>
        <Label htmlFor="cpassword" className="mb-2">
          Confrim Password
        </Label>
        <Input
          id="cpassword"
          type="password"
          name="confirmPassword"
          required
          placeholder="Renter your password"
        />
        <span className="text-red-500 text-sm">
          {formState?.error.confirmPassword?.[0]}
        </span>
      </div>
      <div className="flex flex-col items-center justify-between">
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Registering..." : "Register"}
        </Button>
        <span className="text-red-500 text-sm">{formState?.error.global}</span>
      </div>
    </form>
  );
};

export default RegisterForm;
