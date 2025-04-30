"use client";

import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const SingoutButton = () => {
  return (
    <Button
      className="p-1 h-4"
      size="sm"
      variant="link"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
};

export default SingoutButton;
