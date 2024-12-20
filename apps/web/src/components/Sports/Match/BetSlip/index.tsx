"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  FormInput,
  Input,
  LoadingSpinner,
  useToast,
} from "@repo/ui";
import { useState } from "react";
import { submitBetAction } from "./submitBetAction";
import { useSession } from "next-auth/react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/root-reducer";
import { KeyedMutator } from "swr";
import { Minus, Plus } from "lucide-react";

const amountsList = [100, 200, 500, 1000, 5000, 10000, 20000, 50000, 100000];

export default function Betslip({
  rate,
  price,
  betType,
  eventId,
  marketName,
  marketId,
  runnerName,
  runnerID,
  marketType,
  mutate,
  minStake,
  maxStake,
  betDelay,
}: {
  rate: number;
  price: number;
  betType: "back" | "lay" | "no" | "yes";
  eventId: string;
  marketName: string;
  marketId: string;
  runnerName: string;
  runnerID: string;
  marketType: string;
  mutate: KeyedMutator<any>;
  minStake: number;
  maxStake: number;
  betDelay: number;
}) {
  const { toast } = useToast();

  const session = useSession();

  const [loading, setIsLoading] = useState(false);

  // const balance = useSelector(
  //   (state: RootState) => state.walletBalance.balance
  // );

  const [amount, setAmount] = useState(0);

  const adjustAmount = (increment: boolean) => {
    const currentAmount = Number(amount);
    const newAmount = increment ? currentAmount + 100 : currentAmount - 100;
    if (newAmount >= 0) {
      setAmount(newAmount);
    }
  };

  async function submitBetClient() {
    try {
      setIsLoading(true);

      const exposure =
        betType === "back" || betType === "yes" ? amount : (rate - 1) * amount;

      // if (amount < minStake) {
      //   toast({
      //     title: "Failed to place bet",
      //     description: `Min stake is ${minStake}`,
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // if (amount > maxStake) {
      //   toast({
      //     title: "Failed to place bet",
      //     description: `Max stake is ${maxStake}`,
      //     variant: "destructive",
      //   });
      //   return;
      // }

      if (exposure <= 0) {
        toast({
          title: "Failed to place bet",
          variant: "destructive",
        });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, betDelay * 1000));

      const res = await submitBetAction(
        eventId,
        session.data?.user.id!,
        price,
        rate,
        betType,
        amount,
        marketName,
        marketId,
        runnerName,
        runnerID,
        marketType
      );

      if (res === true) {
        setAmount(0);
        mutate();
        toast({ description: "Bet placed successfully" });
        return;
      }

      toast({
        title: "Failed to place bet",
        description: res,
        variant: "destructive",
      });
    } catch (error) {
      toast({ description: "Failed to place bet", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger
        disabled={price === 0 || rate === 0 ? true : false}
        className="text-black hover:bg-white text-xs rounded-sm font-medium px-3 py-1"
        style={{
          backgroundColor:
            betType === "back" || betType === "yes" ? "#039be5" : "#faa9ba",
          gap: 0,
        }}
      >
        {price === 0 || rate === 0 ? (
          <div className="h-10 text-xxs flex flex-col items-center justify-center">
            -
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-10 px-4 py-2 text-xs font-semibold">
            {rate}
            <span className="block text-xxs font-normal">{price}</span>
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent
        className="ui-bg-[#232325]"
        style={{ backgroundColor: "#232325", border: "#232325" }}
      >
        {/* {loading && (
          <div className="fixed w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40">
            <LoadingSpinner className="w-1/2 h-1/2 mx-auto" />
          </div>
        )} */}

        <DrawerHeader className="border-b pb-4">
          <DrawerTitle>Place Bet</DrawerTitle>
        </DrawerHeader>

        <form method="POST" className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Exposure:</span>
              <div className="text-xl font-semibold text-red-500">
                {(betType === "back" || betType === "lay") && (
                  <>
                    {betType === "back"
                      ? amount
                      : ((rate - 1) * amount).toFixed(2)}
                  </>
                )}

                {(betType === "no" || betType === "yes") && (
                  <>{betType === "no" ? price * (amount / 100) : amount}</>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Rate:</span>
              <div className="text-xl font-semibold text-white">{rate}</div>
            </div>
          </div>

          <div className="bg-emerald-500 text-white p-3 rounded-lg space-y-1">
            <span className="text-sm">Potential Win</span>
            <div className="text-xl font-semibold">
              {" "}
              {(betType === "back" || betType === "lay") && (
                <>
                  {betType === "back"
                    ? ((rate - 1) * amount).toFixed(2)
                    : amount}
                </>
              )}
              {(betType === "no" || betType === "yes") && (
                <> {betType === "no" ? amount : price * (amount / 100)}</>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => adjustAmount(false)}
              className="text-black"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              name="amount"
              type="number"
              id="amount"
              placeholder="Enter Amount"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value as unknown as number)}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => adjustAmount(true)}
              className="text-black"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {amountsList.map((bet) => (
              <Button
                type="button"
                key={bet}
                variant="outline"
                onClick={() => setAmount(bet)}
                className="text-sm text-black"
              >
                {bet.toLocaleString()}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setAmount(0)}
              className="text-sm text-black"
            >
              CLEAR
            </Button>
          </div>

          <Button
            type="button"
            variant={"yellow"}
            className="sm:w-fit w-full"
            onClick={submitBetClient}
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : <span>Place Bet</span>}
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose>
            <Button variant="default">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
