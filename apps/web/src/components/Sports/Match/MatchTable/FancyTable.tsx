"use client";

import { CombinedMatchSettings, Market } from "@/types";
import Betslip from "../BetSlip";
import { KeyedMutator } from "swr";
import { Fancy } from "@repo/types";
import { Info } from "lucide-react";

import FancyBetsDialog from "./FancyBetsDialog";
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

export default function FancyTableComponent({
  data,
  eventId,
  matchName,
  marketId,
  type,
  mutate,
  FancyBets,
  settings,
}: {
  data: Market;
  eventId: string;
  matchName: string;
  marketId: string;
  type: string;
  mutate: KeyedMutator<any>;
  FancyBets?: Fancy[];
  settings?: CombinedMatchSettings;
}) {
  const [matchSettings, setMatchSettings] = useState<MatchSettings | null>(
    null
  );

  useEffect(() => {
    if (settings) {
      if (settings.active) {
        setMatchSettings({
          minStake: settings.preFancyStakesMin,
          maxStake: settings.preFancyStakesMax,
          maxProfit: settings.maxProfitFA,
          betDelay: Number(settings.betDelayFA),
        });
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
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-purple-600 sm:text-lg text-sm">
        <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
        {data.MarketName}
        <TooltipProvider delayDuration={0.5}>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>
              {settings?.active ? (
                <div className="flex flex-col text-xs">
                  <div>Min stake: {settings.preFancyStakesMin}</div>
                  <div>Max stake: {settings.preFancyStakesMax}</div>
                  <div>Max profit: {settings.maxProfitFA}</div>
                </div>
              ) : (
                <div className="flex flex-col text-xs">
                  <div>Min stake: {settings?.minStake}</div>
                  <div>Max stake: {settings?.minStake}</div>
                  <div>Max profit: {Number(settings?.maxStake) * 5}</div>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {data.runners.map((item) => {
        const fancyData = FancyBets?.filter(
          (_item) => _item.RunnerName === item.RunnerName
        );

        return (
          <div
            key={item.RunnerId}
            className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(2,60px)] gap-2 items-center"
          >
            <div className="flex flex-col gap-2">
              {/* <span className="font-semibold">
              {item.RunnerName.slice(0, 2).toUpperCase()}
            </span> */}
              <span className="text-white sm:text-lg text-sm">
                {item.RunnerName}
              </span>

              <span className="text-red-500 flex items-center gap-2 text-sm">
                {fancyData?.map((item) => <FancyBetsDialog fancyData={item} />)}
              </span>
            </div>
            <div className="col-span-3 max-ss:hidden"></div>

            <Betslip
              rate={item.Lay.Rate}
              price={item.Lay.Price}
              betType={"no"}
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

            <Betslip
              rate={item.Back.Rate}
              price={item.Back.Price}
              betType={"yes"}
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
          </div>
        );
      })}
    </div>
  );
}
