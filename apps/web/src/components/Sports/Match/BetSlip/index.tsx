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
import { useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";
import { KeyedMutator } from "swr";

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
}) {
  const { toast } = useToast();

  const session = useSession();

  const [loading, setIsLoading] = useState(false);

  const balance = useSelector(
    (state: RootState) => state.walletBalance.balance
  );

  const [amount, setAmount] = useState(0);

  async function submitBetClient() {
    setIsLoading(true);

    try {
      const exposure =
        betType === "back" || betType === "yes" ? amount : (rate - 1) * amount;

      if (exposure <= 0) {
        toast({
          title: "Failed to place bet",
          variant: "destructive",
        });
        return;
      }

      // if (exposure > balance) {
      //   toast({
      //     title: "Failed to place bet",
      //     description: "insufficient balance",
      //     variant: "destructive",
      //   });
      //   return;
      // }

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
        className="bg-[#72bbef] text-black hover:bg-white text-xs rounded-md font-medium border border-white"
        style={{
          backgroundColor:
            betType === "back" || betType === "yes" ? "#72bbef" : "#faa9ba",
          gap: 0,
        }}
      >
        {price === 0 || rate === 0 ? (
          <div className="h-10 text-xs flex flex-col items-center justify-center">
            {marketType === "Fancy" ? (
              <div>
                Ball <br />
                Running
              </div>
            ) : (
              "Suspended"
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-10 px-4 py-2">
            {rate}
            <span className="block text-xs">{price}</span>
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent
        className="ui-bg-[#232325]"
        style={{ backgroundColor: "#232325", border: "#232325" }}
      >
        {loading && (
          <div className="fixed w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40">
            <LoadingSpinner className="w-1/2 h-1/2 mx-auto" />
          </div>
        )}

        <DrawerHeader>
          <DrawerTitle>
            {(betType === "back" || betType === "lay") && (
              <div className="flex items-center justify-center gap-5">
                <div className="text-green-400">
                  {"Profit: "}
                  {betType === "back"
                    ? ((rate - 1) * amount).toFixed(2)
                    : amount}
                </div>
                <div className="text-red-400">
                  {"Exposure: "}
                  {betType === "back"
                    ? amount
                    : ((rate - 1) * amount).toFixed(2)}
                </div>
              </div>
            )}

            {(betType === "no" || betType === "yes") && (
              <div className="flex items-center justify-center gap-5">
                <div className="text-green-400">
                  {"Profit: "}
                  {betType === "no" ? amount : price * (amount / 100)}
                </div>
                <div className="text-red-400">
                  {"Exposure: "}
                  {betType === "no" ? price * (amount / 100) : amount}
                </div>
              </div>
            )}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col p-5 gap-5">
          <div className="flex items-center flex-wrap sm:gap-5 gap-2">
            {amountsList.map((item) => (
              <Button
                variant="secondary"
                className="sm:ui-text-sm ui-text-xs"
                onClick={() => setAmount(item)}
              >
                {item.toLocaleString()}
              </Button>
            ))}
          </div>

          <form
            method="POST"
            action={submitBetClient}
            className="flex flex-col gap-5"
          >
            <Input
              name="amount"
              type="number"
              id="amount"
              placeholder="Enter Amount"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value as unknown as number)}
            />
            <Button variant={"yellow"} className="w-fit">
              {loading ? <LoadingSpinner /> : <span>Place Bet</span>}
            </Button>
          </form>
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button variant="default">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
