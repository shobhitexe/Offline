import { Market } from "@/types";
import { Button } from "@repo/ui";
import Betslip from "./BetSlip";

export default function MatchTable({
  matchOdds,
  matchId,
}: {
  matchOdds: Market;
  matchId: string;
}) {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-purple-600">
          <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
          {matchOdds.MarketName}
          {/* <span className="text-gray-400">(53636091.28)</span> */}
        </div>

        <div className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(3,3)] gap-2">
          <div></div>
          <div className="col-span-3"></div>
          <Button
            variant="outline"
            className="bg-[#72bbef] text-black hover:bg-[#72bbef]/90"
            style={{ backgroundColor: "#72bbef" }}
          >
            Back
          </Button>
          <Button
            variant="outline"
            className="bg-[#faa9ba] text-black hover:bg-[#faa9ba]/90"
            style={{ backgroundColor: "#faa9ba" }}
          >
            Lay
          </Button>
        </div>
      </div>

      {matchOdds.runners.map((item) => (
        <div
          key={item.RunnerId}
          className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(3,3)] gap-2 items-center"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {item.RunnerName.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-white whitespace-nowrap">
              {item.RunnerName}
            </span>
            <span className="text-green-500">{item.Status}</span>
          </div>
          <div className="col-span-3 max-ss:hidden"></div>

          <Betslip
            rate={item.Back.Rate}
            price={item.Back.Price}
            betType={"back"}
            matchId={""}
            marketName={""}
            marketId={""}
            runnerName={item.RunnerName}
            runnerID={item.RunnerId}
          />

          <Betslip
            rate={item.Lay.Rate}
            price={item.Lay.Price}
            betType={"lay"}
            matchId={""}
            marketName={""}
            marketId={""}
            runnerName={item.RunnerName}
            runnerID={item.RunnerId}
          />
        </div>
      ))}
    </div>
  );
}
