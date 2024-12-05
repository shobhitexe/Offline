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

export default function Betslip({
  rate,
  price,
  betType,
}: {
  rate: number;
  price: number;
  betType: "back" | "lay";
}) {
  const [amount, setAmount] = useState(0);

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

        <form method="POST">
          <FormInput
            name="amount"
            type="number"
            id="amount"
            label={"Amount"}
            onChange={(e) => setAmount(e.target.value as unknown as number)}
          />
          <Button>Place Bet</Button>
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
