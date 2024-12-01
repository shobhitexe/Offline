"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { DropdownMenuItem } from "@repo/ui";

export default function Balance({
  fetchedBalance,
}: {
  fetchedBalance: string;
}) {
  const { balance, setBalance } = useGlobalContext();

  if (fetchedBalance !== balance) {
    setBalance(fetchedBalance);
  }

  return <DropdownMenuItem>Balance : {balance}</DropdownMenuItem>;
}
