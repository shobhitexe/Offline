"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BoxesIcon,
  Button,
  DocumentIcon,
  ProfileIcon,
  WalletIcon,
  LoginIcon,
} from "@repo/ui";
import { signOut, useSession } from "next-auth/react";
import NavSearch from "@/components/Navbar/NavSerach";
import { useDispatch, useSelector } from "react-redux";
import { setSideBarOpen } from "@/store/slices/Sidebar/sidebar-open";
import { RootState } from "@/store/root-reducer";

import { User, BookOpen, MemoryStick, Keyboard, Book } from "lucide-react";

export default function SidebarContent({
  isButton = false,
}: {
  isButton?: boolean;
}): JSX.Element {
  const pathname = usePathname();
  const session = useSession();

  const dispatch = useDispatch();

  const wallet = useSelector((state: RootState) => state.walletBalance);

  return (
    <div
      className={` text-white font-medium w-full xs:p-5 p-0 ${isButton && "max-sm:hidden"} flex flex-col justify-start sm:gap-20 gap-5`}
    >
      <div className="flex flex-col text-left">
        <div className="flex flex-col">
          <div className="text-lg">
            Welcome, {session.data?.user.name || "Guest"}
          </div>
          {/* <div className="font-satoshiMedium text-xs text-white/40">
              Account ID: {session.data?.user.uniqueCode}
            </div> */}
          {/* {session.status === "authenticated" && (
            <div className="ext-xs text-white/40">
              Number: {session.data.user.phone}
            </div>
          )} */}
        </div>

        <div className="pt-3" />
        {/* <NavSearch position="sidebar" /> */}

        {/* <div className="flex my-2">
          {" "}
          <Link
            href={""}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg flex items-center gap-2"
          >
            <SupportIcon />
            <div className="text-sm text-white">Support</div>
          </Link>
        </div> */}

        {session.status === "authenticated" && (
          <div className="flex flex-col gap-3">
            <div className="bg-cardBG px-3 py-1 mt-3 rounded-sm shadow-md flex items-center justify-around text-center font-medium">
              <div>
                {" "}
                <div className="capitalize text-black/80 text-xs">Balance</div>
                <div className="text-sm text-black">{wallet.balance}</div>
              </div>
              <div className="h-5 min-h-full w-px bg-black" />
              <div>
                <div className="capitalize text-black/80 text-xs">Exposue</div>
                <div className="text-sm text-black">{wallet.exposure}</div>
              </div>
            </div>

            <div className="sm:hidden flex flex-col gap-2">
              <div className="flex flex-col divide-y divide-[#483B32] bg-cardBG rounded-lg text-black text-sm mt-2">
                <Link
                  href={"/dashboard/account/settings"}
                  onClick={() => dispatch(setSideBarOpen(false))}
                  className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-t-lg mt-2"
                >
                  <User height={20} width={20} stroke="black" />
                  <span className="relative -top-px">Profile</span>
                </Link>

                <Link
                  onClick={() => dispatch(setSideBarOpen(false))}
                  href={"/dashboard/account/statement"}
                  className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-b-lg"
                >
                  <MemoryStick height={20} width={20} stroke="black" />
                  <span className="relative -top-px">My Bets</span>
                </Link>

                <Link
                  onClick={() => dispatch(setSideBarOpen(false))}
                  href={"/dashboard/account/statement"}
                  className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-b-lg"
                >
                  <BookOpen height={20} width={20} stroke="black" />
                  <span className="relative -top-px">Account Statement</span>
                </Link>

                <Link
                  onClick={() => dispatch(setSideBarOpen(false))}
                  href={"/keyboard-settings"}
                  className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-b-lg"
                >
                  <Keyboard height={20} width={20} stroke="black" />
                  <span className="relative -top-px">Keyboard Settings</span>
                </Link>

                <Link
                  onClick={() => dispatch(setSideBarOpen(false))}
                  href={"/rules"}
                  className="flex items-center gap-2 bg-sidebarButtons p-2 w-full rounded-b-lg"
                >
                  <Book height={20} width={20} stroke="black" />
                  <span className="relative -top-px">Rules</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {session.status === "unauthenticated" && (
          <div className="flex items-center justify-between mt-2 text-sm gap-3">
            {/* <LoginModal isSidebar={true} /> */}

            <Link
              href={"/auth/login"}
              onClick={() => dispatch(setSideBarOpen(false))}
              className="flex items-center gap-1 bg-sidebarButtons p-2 w-full rounded-lg"
            >
              <LoginIcon height={25} width={25} stroke="white" />
              Login
            </Link>
          </div>
        )}

        {/* <ScrollArea
          className={`sm:hidden ui-bg-cardBG flex flex-col mt-4 gap-2 text-black font-medium p-2 rounded-lg overflow-auto ${session.status === "authenticated" ? "h-[160px]" : " h-[450px]"}`}
        >
          {sidebarArrMobile.map((item, idx) => {
            return (
              <Link
                onClick={() => dispatch(setSideBarOpen(false))}
                className={`flex items-center gap-2 ${pathname.split("/").at(-1) === item.link.split("/").at(-1) && "bg-sidebarButtons shadow-md"} py-3 px-2 rounded-sm ${idx + 1 < sidebarArrMobile.length && `border-b border-b-[#483B32]`}`}
                href={item.link}
                key={item.title}
              >
                <div className="text-left text-xs font-medium">
                  {" "}
                  {item.title}
                </div>
              </Link>
            );
          })}{" "}
        </ScrollArea> */}

        {session.status === "authenticated" && (
          <div className="pb-2 mt-3 text-black w-full" autoFocus={false}>
            <Button
              variant={"outline"}
              className="w-full"
              size={"xl"}
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
