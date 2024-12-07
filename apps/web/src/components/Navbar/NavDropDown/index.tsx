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

export const DropDownItems = [
  {
    title: "Account Settings",
    icon: SettingsIcon,
    link: "/dashboard/account/settings",
  },
  {
    title: "Bonus",
    icon: BonusIcon,
    link: "/bonus/casinobonus",
  },
  {
    title: "Referral",
    icon: BonusIcon,
    link: "/dashboard/referral",
  },
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

        {DropDownItems.map((item) => {
          return (
            <DropdownMenuItem
              key={item.title}
              className="flex items-center gap-3 cursor-pointer border-y border-main/5"
            >
              <item.icon width={24} height={24} />
              <Link
                href={item.link}
                className="py-1 mr-10 text-sm font-medium cursor-pointer"
              >
                {item.title}
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuItem className="flex items-center gap-3 cursor-pointer">
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
