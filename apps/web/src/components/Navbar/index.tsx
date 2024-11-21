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

export default async function Navbar() {
  const session = await getServerSession(options);

  return (
    <div className="bg-[#04061b] sm:h-20 h-10 z-20 relative flex items-center justify-between px-5">
      <div className="text-white">Offline</div>
      <div className="flex gap-5">
        <FootballIcon className="w-5 h-5 cursor-pointer" />
        <SearchIcon className="w-5 h-5 cursor-pointer" />

        <div className="flex items-center">
          <div className="text-white">{session?.user.name}</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white">
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
