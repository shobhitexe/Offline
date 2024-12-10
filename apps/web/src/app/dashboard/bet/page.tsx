"use client";

import { BetDetails } from "@/components";
import { placeBet } from "@/lib/apis/bet/placeBet";
import { RootState } from "@/store/root-reducer";
import { setWalletBalance } from "@/store/slices/Wallet/wallet-balance";
import { Button, Input, Label, Toaster, useToast } from "@repo/ui";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

export default function PlaceBet() {
  const session = useSession();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const [betType, setBetType] = useState("");
  const [walletType, setWalletType] = useState("");

  const balance = useSelector((state: RootState) => state.walletBalance);

  return (
    <>
      <BetDetails />
      <form
        className="flex flex-col gap-5 items-center justify-center w-full h-full min-h-screen relative -top-20"
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            if (walletType === "cash" && amount > balance.cash) {
              toast({
                variant: "destructive",
                description: "cannot place bet more than balance",
              });
              return;
            }

            if (walletType === "bonus" && amount > balance.bonus) {
              toast({
                variant: "destructive",
                description: "cannot place bet more than balance",
              });
              return;
            }

            const res = await placeBet(
              session.data?.user.id!,
              Number(amount),
              betType,
              walletType
            );
            toast({ variant: "default", description: res.result.toString() });
            dispatch(
              setWalletBalance({
                ...balance,
                cash: res.newBalance,
                bonus: res.newBonusBalance,
              })
            );
          } catch (error) {
            toast({ variant: "destructive", description: "Failed" });
          }
        }}
      >
        <Toaster />

        <div className="grid w-full items-center gap-1.5 max-w-sm">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            name="amount"
            min={500}
            max={10000}
            onChange={(e) => setAmount(Number(e.target.value))}
            value={amount}
            defaultValue={0}
          />
        </div>

        <Select
          required
          onValueChange={(e) => {
            setBetType(e);
          }}
        >
          <SelectTrigger className="w-[180px] max-w-sm">
            <SelectValue placeholder="Bet Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="casino">Casino</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectContent>
        </Select>

        <Select
          required
          onValueChange={(e) => {
            setWalletType(e);
          }}
        >
          <SelectTrigger className="w-[180px] max-w-sm">
            <SelectValue placeholder="Wallet Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bonus">Bonus</SelectItem>
          </SelectContent>
        </Select>

        <Button>Place bet</Button>
      </form>
    </>
  );
}
