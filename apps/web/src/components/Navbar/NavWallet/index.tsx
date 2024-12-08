"use client";

import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import { RootState } from "@/store/root-reducer";
import { setWalletBalance } from "@/store/slices/Wallet/wallet-balance";
import { DepositIcon } from "@repo/ui";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";

export default function NavWallet() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const balance = useSelector((state: RootState) => state.walletBalance);

  const { data } = useSWR<{ data: { balance: number; exposure: number } }>(
    status === "authenticated"
      ? `${BackendURL}/api/v1/user/wallet/balance?id=${session?.user._id}`
      : null,
    fetcher,
    {
      refreshInterval: 10000,
    }
  );

  useEffect(() => {
    if (data) {
      dispatch(
        setWalletBalance({
          balance: data.data.balance,
          exposure: data.data.exposure,
        })
      );
    }
  }, [data]);

  return (
    <div className="relative md:text-xs text-[10px] flex items-center text-white bg-cardBG/10 sm:px-14 px-3 py-1 sm:rounded-full rounded-md whitespace-nowrap">
      <div className="pr-2"> Balance: {balance.balance}</div>
      <div className="sm:h-4 h-2 sm:w-px w-[0.5px] bg-white rounded-xl" />
      <Link href={"/bonus/casinobonus"} className="pl-2">
        Exposure: {balance.exposure}
      </Link>{" "}
      <div className="inset-x-0 h-px bottom-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent absolute" />
    </div>
  );
}
