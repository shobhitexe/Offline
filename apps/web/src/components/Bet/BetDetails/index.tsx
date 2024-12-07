"use client";

import { Button } from "@repo/ui";
import { useState } from "react";

export default function BetDetails() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {isVisible && (
        <div className="fixed bg-[#121212] border border-[#533802] rounded-2xl max-w-sm left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-30 p-5 flex flex-col items-center justify-center gap-5">
          <div className="text-center">Bet Limit</div>
          <div className="flex items-center gap-10">
            <div>Minimum: 500</div>
            <div>Maximum: 10000</div>
          </div>
          <div>Max Payout: 20000</div>
          <div className="h-px bg-[#533802] w-full" />
          <Button onClick={() => setIsVisible(false)}>
            Continue to Gameplay
          </Button>
        </div>
      )}
    </>
  );
}
