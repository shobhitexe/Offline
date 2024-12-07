"use client";

import { BackendURL } from "@/config/env";
import { RootState } from "@/store/root-reducer";
import { setWalletBalance } from "@/store/slices/Wallet/wallet-balance";
import { DepositIcon } from "@repo/ui";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

export default function NavWallet() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const balance = useSelector((state: RootState) => state.walletBalance);

  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (session && session.user?._id) {
      const newSocket = io(`${BackendURL}/socket/player/wallet/balance`, {
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        newSocket.emit("user", {
          user: session.user._id,
        });
      });

      newSocket.on("balance", (data: { cash: number; bonus: number }) => {
        dispatch(
          setWalletBalance({
            cash: data.cash || 0,
            bonus: data.bonus || 0,
          })
        );
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        newSocket.disconnect();
      };
    }

    return () => {};
  }, [session]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        socket &&
        session?.user?._id
      ) {
        socket.emit("user", { user: session.user._id });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, session?.user?._id]);

  return (
    <>
      <div className="relative md:text-xs text-[10px] flex items-center text-white bg-cardBG/10 sm:px-14 px-3 py-1 sm:rounded-full rounded-md whitespace-nowrap">
        <div className="sm:pr-2"> Cash: {balance.cash}</div>
        <div className="h-4 w-px bg-white sm:flex hidden" />
        <Link href={"/bonus/casinobonus"} className="pl-2 sm:flex hidden">
          Bonus: {balance.bonus}
        </Link>{" "}
        <div className="inset-x-0 h-px bottom-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent absolute" />
      </div>

      <Link href="/dashboard/wallet/deposit" className="sm:hidden flex">
        <DepositIcon className="w-6 h-6" />
      </Link>
    </>
  );
}
