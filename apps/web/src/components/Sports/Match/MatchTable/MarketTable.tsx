import { BetHistoryPerGame, GroupedStats, Market } from "@/types";
import Betslip from "../BetSlip";

import { ArrowRight } from "lucide-react";

export default function MarketTableComponent({
  data,
  eventId,
  matchName,
  marketId,
  type,
  bets,
}: {
  data: Market;
  eventId: string;
  matchName: string;
  marketId: string;
  type: string;
  bets?: Record<string, GroupedStats>;
}) {
  return (
    <div className="flex flex-col gap-3 ">
      <div className="flex items-center gap-2 text-purple-600 sm:text-lg text-sm">
        <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
        {data.MarketName}
        {/* <span className="text-gray-400">(53636091.28)</span> */}
      </div>
      {data.runners.map((item) => (
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
            <span className="text-green-500 flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4" />{" "}
              {bets ? bets[item.RunnerId].totalPnl : 0}
            </span>
          </div>
          <div className="col-span-3 max-ss:hidden"></div>

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
          />

          <Betslip
            rate={item.Lay.Rate}
            price={item.Lay.Price}
            betType={"lay"}
            eventId={eventId}
            marketName={matchName}
            marketId={marketId}
            runnerName={item.RunnerName}
            runnerID={item.RunnerId}
            marketType={type}
          />
        </div>
      ))}
    </div>
  );
}
