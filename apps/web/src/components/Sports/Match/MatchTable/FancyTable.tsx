import { Market } from "@/types";
import Betslip from "../BetSlip";

export default function FancyTableComponent({
  data,
  eventId,
  matchName,
  marketId,
  type,
}: {
  data: Market;
  eventId: string;
  matchName: string;
  marketId: string;
  type: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-purple-600">
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
            {/* <span className="font-semibold">
              {item.RunnerName.slice(0, 2).toUpperCase()}
            </span> */}
            <span className="text-white">{item.RunnerName}</span>
            {/* <span className="text-green-500">{item.Status}</span> */}
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
          />
        </div>
      ))}
    </div>
  );
}
