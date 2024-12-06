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
} from "@repo/ui";
import { useState } from "react";
import { submitBetAction } from "./submitBetAction";

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
      <DrawerTrigger>
        <Button variant={"yellow"}>
          {rate}
          <br />
          {price}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
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

        <form method="POST" action={submitBetClient}>
          <FormInput
            name="amount"
            type="number"
            id="amount"
            label={"Amount"}
            required
            onChange={(e) => setAmount(e.target.value as unknown as number)}
          />
          <Button variant={"yellow"}>Place Bet</Button>
        </form>

        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
