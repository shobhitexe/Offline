"use client";

import { setWalletBalance } from "@/store/slices/Wallet/wallet-balance";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCcw } from "lucide-react";
import useSWR from "swr";
import fetcher from "@/lib/data/setup";
import { BackendURL } from "@/config/env";
import { RootState } from "@/store/root-reducer";

export default function NavWallet() {
  const session = useSession();
  const dispatch = useDispatch();
  const previousBalanceRef = useRef<number | null>(null);

  const balance = useSelector((root: RootState) => root.walletBalance);

  const { data, mutate } = useSWR<{
    data: { balance: number; exposure: number };
  }>(
    `${BackendURL}/api/v1/user/wallet/balance?id=${session.data?.user.id}`,
    fetcher
    // { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (data?.data) {
      const { balance } = data.data;
      if (balance !== previousBalanceRef.current) {
        previousBalanceRef.current = balance;
        dispatch(setWalletBalance(data.data));
      }
    }
  }, [data, dispatch]);

  return (
    <div className="flex items-center gap-2 relative -top-px">
      <RefreshCcw
        className="w-4 h-4 hover:animate-spin cursor-pointer"
        onClick={() => {
          mutate();
        }}
      />
      <div className="xs:text-xs text-xxs font-semibold">
        <div>
          Balance:{" "}
          <span className="text-[#00EF80] font-semibold">
            {data?.data ? balance.balance : 0}
          </span>
        </div>
        <div>
          Exposure:{" "}
          <span className="text-[#FF6372] font-semibold">
            {data?.data ? balance.exposure : 0}
          </span>
        </div>
      </div>
    </div>
  );
}
