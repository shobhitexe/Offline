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
} from "@repo/ui";
import { useState } from "react";
import { submitBetAction } from "./submitBetAction";

const amountsList = [100, 200, 500, 1000, 5000, 10000, 20000, 50000, 100000];

export default function Betslip({
  rate,
  price,
  betType,
  matchId,
  marketName,
  marketId,
  runnerName,
  runnerID,
}: {
  rate: number;
  price: number;
  betType: "back" | "lay";
  matchId: string;
  marketName: string;
  marketId: string;
  runnerName: string;
  runnerID: string;
}) {
  const [amount, setAmount] = useState(0);

  async function submitBetClient() {
    try {
      const res = await submitBetAction(
        matchId,
        "2",
        price,
        rate,
        betType,
        amount,
        marketName,
        marketId,
        runnerName,
        runnerID
      );

      if (res) {
        alert("Bet placed");
        return;
      }

      alert("Failed");
    } catch (error) {
      alert("Failed");
    }
  }

  return (
    <Drawer>
      <DrawerTrigger
        className="bg-[#72bbef] text-black hover:bg-white h-10 px-4 py-2 flex flex-col items-center justify-center text-sm rounded-md font-medium border border-white"
        style={{
          backgroundColor: betType === "back" ? "#72bbef" : "#faa9ba",
          gap: 0,
        }}
      >
        {rate}
        <span className="block text-xs">{price}</span>
      </DrawerTrigger>
      <DrawerContent
        className="ui-bg-[#232325]"
        style={{ backgroundColor: "#232325", border: "#232325" }}
      >
        <DrawerHeader>
          <DrawerTitle>
            {betType === "back" ? (
              <>
                {"Profit: "}
                {((rate - 1) * amount).toFixed(2)}
              </>
            ) : (
              <>
                {"Exposure: "}
                {((rate - 1) * amount - amount).toFixed(2)}
              </>
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
              Place Bet
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
