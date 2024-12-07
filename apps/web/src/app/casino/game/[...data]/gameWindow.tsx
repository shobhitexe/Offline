"use client";

import { Button } from "@repo/ui";
import { Maximize } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export default function GameWindow({
  frameSrc,
  minBet,
  maxBet,
  maxWin,
}: {
  frameSrc: string;
  minBet: number;
  maxBet: number;
  maxWin: number;
}) {
  const handle = useFullScreenHandle();

  const [limitWarning, setLimitWarning] = useState(true);

  return (
    <div className="relative min-h-screen bg-cardBG bg-center bg-contain bg-no-repeat flex flex-col gap-2 sm:px-1 sm:py-3 rounded-xl">
      {limitWarning && (
        <div className="absolute left-1/2 -translate-x-1/2 top-1/4 bg-cardBG border shadow-xl rounded-2xl p-5 text-black flex flex-col gap-5 justify-center items-center">
          <div className="font-bold">Bet Limit</div>

          <div className="flex items-center gap-10">
            <div>Minimum: {minBet.toLocaleString()}</div>
            <div>Maximum: {maxBet.toLocaleString()}</div>
          </div>

          <div>Max Payout: {maxWin.toLocaleString()}</div>

          <div>
            <Button onClick={() => setLimitWarning(false)}>
              Continue to play
            </Button>
          </div>
        </div>
      )}
      <div
        className="sm:flex hidden items-center gap-1 text-black self-end cursor-pointer px-3"
        onClick={handle.enter}
      >
        <Maximize color="black" className="w-5 h-5" />
        <div>Fullscreen</div>
      </div>

      <FullScreen handle={handle} className="w-full h-full bg-black">
        <iframe
          src={frameSrc}
          className="w-full min-h-screen h-full block"
          allowFullScreen
          allow="xr-spatial-tracking"
        />
      </FullScreen>
    </div>
  );
}
