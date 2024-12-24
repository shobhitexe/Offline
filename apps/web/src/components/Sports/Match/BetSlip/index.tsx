"use client";

import {
  Button,
  buttonVariants,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  Input,
  LoadingSpinner,
  useToast,
} from "@repo/ui";
import { useEffect, useState } from "react";
import { submitBetAction } from "./submitBetAction";
import { useSession } from "next-auth/react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/root-reducer";
import useSWR, { KeyedMutator } from "swr";
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";
import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import { setWalletBalance } from "@/store/slices/Wallet/wallet-balance";

type Chip = {
  name: string;
  value: number;
};

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

  const dispatch = useDispatch();

  const [loading, setIsLoading] = useState(false);

  const [chips, setChips] = useState<Chip[]>(() => {
    const savedChips = localStorage.getItem("chipsData");
    return savedChips
      ? JSON.parse(savedChips)
      : [
          { name: "100", value: 100 },
          { name: "500", value: 500 },
          { name: "1K", value: 1000 },
          { name: "5K", value: 5000 },
          { name: "10K", value: 10000 },
          { name: "25K", value: 25000 },
          { name: "50K", value: 50000 },
          { name: "1L", value: 100000 },
          { name: "5L", value: 500000 },
          { name: "10L", value: 1000000 },
        ];
  });

  const balance = useSelector(
    (state: RootState) => state.walletBalance.balance
  );

  const { data, mutate: balanceMutate } = useSWR<{
    data: { balance: number; exposure: number };
  }>(
    `${BackendURL}/api/v1/user/wallet/balance?id=${session.data?.user.id}`,
    fetcher
    // { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(setWalletBalance(data?.data));
    }
  }, [data]);

  const [amount, setAmount] = useState(0);
  const [betRate, setRate] = useState(rate);

  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    setRate(rate);
  }, [rate]);

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

      let exposure;

      switch (betType) {
        case "back":
          exposure = amount;
          break;
        case "lay":
          exposure = (rate - 1) * amount;
          break;
        case "no":
          exposure = price * (amount / 100);
          break;
        case "yes":
          exposure = amount;
          break;
        default:
          exposure = 0;
      }

      if (exposure < minStake) {
        toast({
          title: "Failed to place bet",
          description: `Min stake is ${minStake}`,
          variant: "destructive",
        });
        return;
      }

      if (exposure > maxStake) {
        toast({
          title: "Failed to place bet",
          description: `Max stake is ${maxStake}`,
          variant: "destructive",
        });
        return;
      }

      if (balance <= 0) {
        toast({
          title: "Failed to place bet",
          variant: "destructive",
        });
        return;
      }

      if (balance - exposure < 0) {
        toast({
          title: "Failed to place bet",
          description: "Insufficient balance",
          variant: "destructive",
        });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, betDelay * 1000));

      const res = await submitBetAction(
        eventId,
        session.data?.user.id!,
        price,
        betRate,
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
        setIsOpen(false);
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
      balanceMutate();
      setIsLoading(false);
    }
  }

  return (
    <Drawer onOpenChange={() => setIsOpen((prev) => !prev)} open={open}>
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
            <span className="block text-xxs">{price}</span>
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent
        className="ui-bg-[#232325] "
        style={{ backgroundColor: "#232325", border: "#232325" }}
      >
        {loading && (
          <div className="fixed w-full h-full left-1/2 top-1/2a -translate-x-1/2 -translate-y-1/2 bg-black/40s">
            <LoadingSpinner className="w-1/2 h-1/2 mx-auto" />
          </div>
        )}

        <form method="POST" className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-3 text-center text-black text-sm">
            <div className="bg-red-400 rounded-md font-medium py-1">
              Exposure:
              <span>
                {" "}
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
              </span>
            </div>
            <div className="bg-emerald-500 rounded-md font-medium py-1">
              Profit:
              <span>
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
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (betType === "back") {
                    setRate((prev) => prev - 0.01);
                  }
                }}
                className="text-black"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                name="betRate"
                type="number"
                id="betRate"
                placeholder="Enter Amount"
                required
                value={betRate}
                disabled
                className="text-center"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (betType === "lay") {
                    setRate((prev) => prev + 0.01);
                  }
                }}
                className="text-black"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {chips.map((bet) => (
              <Button
                type="button"
                key={bet.name}
                variant="outline"
                onClick={() => setAmount(bet.value)}
                className="ui-text-sm text-black"
              >
                {bet.name}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setAmount(0)}
              className="ui-text-sm text-black"
            >
              CLEAR
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={"yellow"}
              className="sm:w-fit w-full"
              onClick={submitBetClient}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner className="absolute" />
              ) : (
                <span>Place Bet</span>
              )}
            </Button>
            <DrawerClose>
              <div className={`${buttonVariants({ className: "w-full" })}`}>
                Cancel
              </div>
            </DrawerClose>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
