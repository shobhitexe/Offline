import { Market } from "@/types";
import { Button } from "@repo/ui";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

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
  bets?: Record<string, number>;
}) {
  const session = useSession();

  function reverseSign(num: number) {
    return -num;
  }

  return (
    <div className="flex flex-col gap-3 ">
      <div className="flex items-center gap-2 text-sm text-purple-600">
        <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
        {data.MarketName}
        {/* <span className="text-gray-400">(53636091.28)</span> */}
      </div>
      {data.runners.map((item) => {
        const currbets = reverseSign(
          bets !== undefined && bets !== null ? bets[item.RunnerName] : 0
        );

        return (
          <div
            key={item.RunnerId}
            className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(2,60px)] gap-2 items-center"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {item.RunnerName.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-black whitespace-nowrap">
                {item.RunnerName}
              </span>
              <span
                className={`${(currbets || 0) >= 0 ? "text-green-500" : "text-red-500"} flex items-center gap-2 text-sm`}
              >
                <ArrowRight className="w-4 h-4" />{" "}
                {(
                  (currbets || 0) *
                  (session.data?.user.sportsShare! / 100)
                ).toFixed(2)}
              </span>
            </div>
            <div className="col-span-3 max-ss:hidden"></div>

            <Button
              className="text-black hover:bg-white text-sm rounded-md font-medium border border-white"
              style={{
                backgroundColor: "#72bbef",
                gap: 0,
              }}
            >
              {item.Back.Price === 0 || item.Back.Rate === 0 ? (
                <div className="h-10 text-xs flex flex-col items-center justify-center">
                  {"Suspended"}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-10 px-4 py-2 text-black">
                  {item.Back.Rate}
                  <span className="block text-xs">{item.Back.Price}</span>
                </div>
              )}
            </Button>

            <Button
              className="text-black hover:bg-white text-sm rounded-md font-medium border border-white"
              style={{
                backgroundColor: "#faa9ba",
                gap: 0,
              }}
            >
              {item.Lay.Price === 0 || item.Lay.Rate === 0 ? (
                <div className="h-10 text-xs flex flex-col items-center justify-center">
                  {"Suspended"}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-10 px-4 py-2 text-black">
                  {item.Lay.Rate}
                  <span className="block text-xs">{item.Lay.Price}</span>
                </div>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
