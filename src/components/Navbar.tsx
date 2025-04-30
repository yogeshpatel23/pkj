import React from "react";
import SingoutButton from "./SingoutButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import GetTokenForm from "./account/GetTokenForm";

const Navbar = ({ session }: { session: any | null }) => {
  return (
    <nav className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl">Paiso Ka Jungal</h1>
      <div>
        {session && (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>{session.user?.name}</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <GetTokenForm id={session.user?.id} />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/account/edit">Edit Account</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SingoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
