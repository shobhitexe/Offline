import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FootballIcon,
  SearchIcon,
} from "@repo/ui";
import { ChevronDown } from "lucide-react";
import { getServerSession } from "next-auth";
import Logout from "./Logout";
import Profile from "./Profile";
import { universalGET } from "@/lib/requests";

async function getBalance(id: string) {
  try {
    const res = await universalGET(`/admin/wallet/balance?id=${id}`);

    if (res.data === 0) {
      return 0;
    }

    if (res.data) {
      return res.data;
    }

    return "NaN";
  } catch (error) {
    return "NaN";
  }
}

export default async function Navbar() {
  const session = await getServerSession(options);

  const balance = await getBalance(session?.user.id!);

  return (
    <div className="bg-[#04061b] sm:h-20 h-10 z-20 relative flex items-center justify-between px-5">
      <div className="text-white">Offline</div>
      <div className="flex gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-white">
            <FootballIcon className="w-5 h-5 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Stats</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              Child Level: {session?.user.childLevel}
            </DropdownMenuItem>
            <DropdownMenuItem>Exposure: 0</DropdownMenuItem>
            <DropdownMenuItem>Balance : {balance}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <SearchIcon className="w-5 h-5 cursor-pointer" />

        <div className="flex items-center">
          <div className="text-white">{session?.user.name}</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white">
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Profile />
              <DropdownMenuItem>Change Password</DropdownMenuItem>
              <DropdownMenuItem>Terms Condition</DropdownMenuItem>
              <Logout />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}