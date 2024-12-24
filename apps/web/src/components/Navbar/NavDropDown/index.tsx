import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  BonusIcon,
  BoxesIcon,
  DepositIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  ProfileRoundIcon,
  SettingsIcon,
  StatementIcon,
  WithdrawIcon,
} from "@repo/ui";
import { getServerSession } from "next-auth";
import Link from "next/link";

import React from "react";
import NavWalletData from "./Wallet";
import LogOut from "./LogOutButton";

import { User, BookOpen, MemoryStick, Keyboard, Book } from "lucide-react";

export const DropDownItems = [
  {
    title: "Account Settings",
    icon: SettingsIcon,
    link: "/dashboard/account/settings",
  },
  // {
  //   title: "Bonus",
  //   icon: BonusIcon,
  //   link: "/bonus/casinobonus",
  // },
  // {
  //   title: "Referral",
  //   icon: BonusIcon,
  //   link: "/dashboard/referral",
  // },
  // {
  //   title: "Deposit",
  //   icon: DepositIcon,
  //   link: "/dashboard/wallet/deposit",
  // },
  // {
  //   title: "Withdraw",
  //   icon: WithdrawIcon,
  //   link: "/dashboard/wallet/withdrawal",
  // },
  {
    title: "Account Statement",
    icon: StatementIcon,
    link: "/dashboard/account/statement",
  },
];

export default async function NavDropDown() {
  const session = await getServerSession(options);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfileRoundIcon width={30} height={30} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ui-bg-cardBG p-0">
        <DropdownMenuLabel className="flex items-start justify-start gap-1 text-black bg-inputField">
          <span className="text-sm font-medium">{session?.user.name}</span>
        </DropdownMenuLabel>

        <NavWalletData />

        <DropdownMenuItem className="flex flex-col gap-2">
          <div className="flex flex-col divide-y divide-[#483B32] bg-cardBG rounded-lg text-black text-sm mt-2">
            <Link
              href={"/dashboard/account/settings"}
              className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-t-lg mt-2"
            >
              <User height={20} width={20} stroke="black" />
              <span className="relative -top-px">Profile</span>
            </Link>

            <Link
              href={"/dashboard/account/statement/bets"}
              className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-b-lg"
            >
              <MemoryStick height={20} width={20} stroke="black" />
              <span className="relative -top-px">My Bets</span>
            </Link>

            <Link
              href={"/dashboard/account/statement"}
              className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-b-lg"
            >
              <BookOpen height={20} width={20} stroke="black" />
              <span className="relative -top-px">Account Statement</span>
            </Link>

            <Link
              href={"/keyboard-settings"}
              className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-b-lg"
            >
              <Keyboard height={20} width={20} stroke="black" />
              <span className="relative -top-px">Keyboard Settings</span>
            </Link>

            <Link
              href={"/rules"}
              className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-b-lg"
            >
              <Book height={20} width={20} stroke="black" />
              <span className="relative -top-px">Rules</span>
            </Link>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 cursor-pointer">
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
