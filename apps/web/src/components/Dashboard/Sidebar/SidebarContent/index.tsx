"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BoxesIcon,
  Button,
  DocumentIcon,
  GiftIcon,
  LinkComponent,
  ProfileIcon,
  RegisterUserIcon,
  ScrollArea,
  WalletIcon,
  LoginIcon,
  DepositIcon,
  WithdrawIcon,
  BonusIcon,
  SettingsIcon,
  StatementIcon,
} from "@repo/ui";
import { signOut, useSession } from "next-auth/react";
import NavSearch from "@/components/Navbar/NavSerach";
import { useDispatch, useSelector } from "react-redux";
import { setSideBarOpen } from "@/store/slices/Sidebar/sidebar-open";
import { RootState } from "@/store/root-reducer";

export const sidebarArr = [
  {
    title: "My profile",
    icon: ProfileIcon,
    link: "/dashboard/profile/details",
  },
  {
    title: "Deposits and withdrawals",
    icon: WalletIcon,
    link: "/dashboard/wallet/deposit",
  },
  {
    title: "Account statement",
    icon: BoxesIcon,
    link: "/dashboard/account/statement",
  },
  {
    title: "Referral",
    icon: DocumentIcon,
    link: "/dashboard/referral",
  },
];

export const sidebarArrMobile = [
  { title: "TOP GAMES", link: "" },
  { title: "DIGITAIN", link: "" },
  { title: "EZUGI", link: "" },
  { title: "EVOLUTION", link: "" },
  { title: "SPRIBE", link: "" },
  { title: "SEVENMOJOS", link: "" },
  { title: "VIVO", link: "" },
  { title: "KIRON", link: "" },
  { title: "BGAMING", link: "" },
  { title: "ASPECTGAMES", link: "" },
  { title: "GLOBALBET", link: "" },
  { title: "LUCKY STREAK", link: "" },
  { title: "MATRIX GAMING", link: "" },
];

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
              <div className="flex items-center justify-between text-sm gap-2">
                <Link
                  onClick={() => dispatch(setSideBarOpen(false))}
                  href={"/dashboard/wallet/deposit"}
                  className="flex items-center justify-center gap-3 bg-sidebarButtons p-2 w-full rounded-lg bg-cardBG text-black"
                >
                  <DepositIcon height={25} width={25} stroke="black" />
                  Deposit
                </Link>

                <Link
                  href={"/dashboard/wallet/withdrawal"}
                  onClick={() => dispatch(setSideBarOpen(false))}
                  className="flex items-center justify-center gap-2 bg-sidebarButtons p-2 w-full rounded-lg bg-cardBG text-black"
                >
                  <WithdrawIcon height={25} width={25} stroke="black" />
                  Withdrawal
                </Link>
              </div>

              <div className="flex items-center justify-between text-sm gap-2">
                <Link
                  href={"/bonus/casinobonus"}
                  onClick={() => dispatch(setSideBarOpen(false))}
                  className="flex items-center justify-center gap-1 bg-sidebarButtons p-2 w-full rounded-lg mt-2 bg-cardBG text-black"
                >
                  <BonusIcon height={25} width={25} stroke="black" />
                  Bonus
                </Link>

                <Link
                  href={"/dashboard/referral"}
                  onClick={() => dispatch(setSideBarOpen(false))}
                  className="flex items-center justify-center gap-1 bg-sidebarButtons p-2 w-full rounded-lg mt-2 bg-cardBG text-black"
                >
                  <BonusIcon height={25} width={25} stroke="black" />
                  Referral
                </Link>
              </div>

              <div className="flex flex-col divide-y divide-[#483B32] bg-cardBG rounded-lg text-black text-sm mt-2">
                <Link
                  href={"/dashboard/account/settings"}
                  onClick={() => dispatch(setSideBarOpen(false))}
                  className="flex items-center gap-1 bg-sidebarButtons p-2 w-full rounded-t-lg mt-2"
                >
                  <SettingsIcon height={25} width={25} stroke="black" />
                  Account Settings
                </Link>

                <Link
                  onClick={() => dispatch(setSideBarOpen(false))}
                  href={"/dashboard/account/statement"}
                  className="flex items-center gap-1 bg-sidebarButtons p-2 w-full rounded-b-lg"
                >
                  <StatementIcon height={25} width={25} stroke="black" />
                  Account Statement
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

            <Link
              href={"/auth/register"}
              onClick={() => dispatch(setSideBarOpen(false))}
              className="flex items-center gap-1 bg-sidebarButtons p-2 w-full rounded-lg"
            >
              <RegisterUserIcon height={25} width={25} stroke="white" />
              Register
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
          <div className="pb-2 mt-3 text-black" autoFocus={false}>
            <Button variant={"outline"} size={"xl"} onClick={() => signOut()}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SupportIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M5 7.5C5 4.73828 7.23828 2.5 10 2.5C12.7617 2.5 15 4.73828 15 7.5C15 8.04297 14.9141 8.56641 14.7539 9.05469C14.4297 9.62109 13.8203 10 13.125 10H12.7891C12.3555 9.25391 11.5508 8.75 10.625 8.75H9.375C7.99609 8.75 6.875 9.87109 6.875 11.25C6.875 11.3047 6.875 11.3555 6.87891 11.4062C5.73438 10.4922 5 9.08203 5 7.5Z"
        fill="white"
      />
      <path
        d="M10 1.25C6.54688 1.25 3.75 4.04688 3.75 7.5V8.125C3.75 8.46875 3.46875 8.75 3.125 8.75C2.78125 8.75 2.5 8.46875 2.5 8.125V7.5C2.5 3.35938 5.85938 0 10 0C14.1406 0 17.5 3.35938 17.5 7.5V8.125C17.5 10.543 15.543 12.5 13.125 12.5H10.625H10H9.375C8.68359 12.5 8.125 11.9414 8.125 11.25C8.125 10.5586 8.68359 10 9.375 10H10.625C11.3164 10 11.875 10.5586 11.875 11.25H13.125C14.8516 11.25 16.25 9.85156 16.25 8.125V7.5C16.25 4.04688 13.4531 1.25 10 1.25ZM6.5 13.75H13.5C16.3984 13.75 18.75 16.1016 18.75 19C18.75 19.5508 18.3008 20 17.75 20H2.25C1.69922 20 1.25 19.5508 1.25 19C1.25 16.1016 3.60156 13.75 6.5 13.75Z"
        fill="white"
      />
    </svg>
  );
}
