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
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-2 text-main sm:text-lg text-xs font-medium border-b border-inputField pb-1">
        <span className="inline-block w-2 h-2 bg-red-400 rounded-full"></span>
        {data.MarketName}
        <TooltipProvider delayDuration={0.5}>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3" />
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
            className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(2,65px)] gap-1 items-start mt-1 relative"
          >
            <div className="flex flex-col items-start text-main">
              {/* <span className="font-semibold sm:text-base text-sm">
                {item.RunnerName.slice(0, 2).toUpperCase()}
              </span> */}
              <span className="text-[#7e7e7e] sm:text-sm text-xs font-semibold uppercase">
                {item.RunnerName}
              </span>
              <span
                className={`${(currbets || 0) >= 0 ? "text-green-500" : "text-red-500"} flex font-medium items-center gap-1 text-xs`}
              >
                <ArrowRight className="w-4 h-4" /> {currbets || 0}
              </span>
            </div>
            <div className="col-span-3 max-ss:hidden"></div>

            {(item.Back.Rate === 0 ||
              item.Back.Price === 0 ||
              item.Lay.Rate === 0 ||
              item.Lay.Price === 0) && (
              <div className="absolute right-0 h-12 bg-main/40 ss:w-[167px] w-[133px] rounded-sm text-xs text-center flex items-center justify-center font-semibold">
                Suspended
              </div>
            )}

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
