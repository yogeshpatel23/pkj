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
      <div className="flex gap-1">
        <Link href="/" className="text-2xl">
          InvestoTrack
        </Link>
        <span className="text-xs text-blue-300">by VYStocks</span>
      </div>
      <ul className="flex gap-4">
        <li>
          <Link className="hover:border-b-2 border-blue-500 pb-1" href="/pkj">
            Paiso ka Jangal
          </Link>
        </li>
        <li>
          <Link className="hover:border-b-2 border-blue-500 pb-1" href="/lifo">
            ETF Shop
          </Link>
        </li>
      </ul>
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
