import { Market } from "@/types";
import { Button } from "@repo/ui";

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
            <span className="text-black">{item.RunnerName}</span>
            {/* <span className="text-green-500">{item.Status}</span> */}
          </div>
          <div className="col-span-3 max-ss:hidden"></div>

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
              <div className="flex flex-col items-center justify-center h-10 px-4 py-2">
                {item.Lay.Rate}
                <span className="block text-xs">{item.Lay.Price}</span>
              </div>
            )}
          </Button>

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
              <div className="flex flex-col items-center justify-center h-10 px-4 py-2">
                {item.Back.Rate}
                <span className="block text-xs">{item.Back.Price}</span>
              </div>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
