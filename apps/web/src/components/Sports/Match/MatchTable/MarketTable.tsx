"use client";

import { CombinedMatchSettings, Market } from "@/types";
import Betslip from "../BetSlip";
import { ArrowRight, Info } from "lucide-react";
import { KeyedMutator } from "swr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import { useEffect, useState } from "react";

type MatchSettings = {
  minStake: number;
  maxStake: number;
  maxProfit: number;
  betDelay: number;
};

export default function MarketTableComponent({
  data,
  eventId,
  matchName,
  marketId,
  type,
  bets,
  settings,
  mutate,
}: {
  data: Market;
  eventId: string;
  matchName: string;
  marketId: string;
  type: string;
  bets?: Record<string, number>;
  settings?: CombinedMatchSettings;
  mutate: KeyedMutator<any>;
}) {
  const [matchSettings, setMatchSettings] = useState<MatchSettings | null>(
    null
  );

  useEffect(() => {
    if (settings) {
      if (settings.active) {
        if (type === "Match Odds") {
          setMatchSettings({
            minStake: settings.preMOStakesMin,
            maxStake: settings.preMOStakesMax,
            maxProfit: settings.maxProfitMO,
            betDelay: Number(settings.betDelayMO),
          });
        } else {
          setMatchSettings({
            minStake: settings.preBMStakesMin,
            maxStake: settings.preBMStakesMax,
            maxProfit: settings.maxProfitBM,
            betDelay: Number(settings.betDelayBM),
          });
        }
      } else {
        setMatchSettings({
          minStake: settings.minStake,
          maxStake: settings.minStake,
          maxProfit: Number(settings.maxStake) * 5,
          betDelay: Number(settings.betDelay),
        });
      }
    }
  }, [settings, type]);
  return (
    <div className="flex flex-col gap-3 ">
      <div className="flex items-center gap-2 text-purple-600 sm:text-lg text-sm">
        <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
        {data.MarketName}
        <TooltipProvider delayDuration={0.5}>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col text-xs">
                <div>Min stake: {matchSettings?.maxStake}</div>
                <div>Max stake: {matchSettings?.maxStake}</div>
                <div>Max profit: {matchSettings?.maxProfit}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {data.runners.map((item) => {
        const currbets =
          bets !== undefined && bets !== null ? bets[item.RunnerName] : 0;

        return (
          <div
            key={item.RunnerId}
            className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(2,60px)] gap-2 items-center"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold sm:text-base text-sm">
                {item.RunnerName.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-white whitespace-nowrap sm:text-base text-sm">
                {item.RunnerName}
              </span>
              <span
                className={`${(currbets || 0) >= 0 ? "text-green-500" : "text-red-500"} flex items-center gap-2 text-sm`}
              >
                <ArrowRight className="w-4 h-4" /> {currbets || 0}
              </span>
            </div>
            <div className="col-span-3 max-ss:hidden"></div>

            {/* Betslip for 'back' */}
            <Betslip
              rate={item.Back.Rate}
              price={item.Back.Price}
              betType={"back"}
              eventId={eventId}
              marketName={matchName}
              marketId={marketId}
              runnerName={item.RunnerName}
              runnerID={item.RunnerId}
              marketType={type}
              mutate={mutate}
              minStake={matchSettings?.minStake || 0}
              maxStake={matchSettings?.maxStake || 0}
              betDelay={matchSettings?.betDelay || 0}
            />

            {/* Betslip for 'lay' */}
            <Betslip
              rate={item.Lay.Rate}
              price={item.Lay.Price}
              betType={"lay"}
              eventId={eventId}
              marketName={matchName}
              marketId={marketId}
              runnerName={item.RunnerName}
              runnerID={item.RunnerId}
              mutate={mutate}
              marketType={type}
              minStake={matchSettings?.minStake || 0}
              maxStake={matchSettings?.maxStake || 0}
              betDelay={matchSettings?.betDelay || 0}
            />
          </div>
        );
      })}
    </div>
  );
}
