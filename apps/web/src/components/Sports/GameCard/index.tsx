import { BackendURL } from "@/config/env";
import { EventType, Market } from "@/types";
import Link from "next/link";
import PlayAnimation from "./PlayAnimation";

async function getMatchOddsData(eventId: string) {
  try {
    const res = await fetch(
      `${BackendURL}/api/v1/sports/matchodds?eventId=${eventId}`
    );

    if (res.status !== 200) {
      return [];
    }

    const _res = await res.json();

    return _res.data || [];
  } catch (error) {
    return [];
  }
}

export default async function GameCard({ event }: { event: EventType }) {
  const data: Market = await getMatchOddsData(event.eventId);

  return (
    <Link href={`/sports/match/${event.eventId}`} className="py-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:p-4 p-2 cursor-pointer">
        <div className="flex items-start pt-1 w-full sm:gap-5 gap-3">
          <PlayAnimation time={event.eventTime} />

          <div className="flex flex-col gap-0 text-main">
            <span className="font-medium hover:underline sm:text-sm text-xs uppercase">
              {event.eventName}
            </span>
            <div className="text-sm text-muted-foreground sm:text-xs text-xxs">
              {event.category}
            </div>
            {/* <div className="text-sm text-muted-foreground sm:text-sm text-xxs">
              {event.eventTime}
            </div> */}
          </div>
        </div>

        <div className="sm:flex hidden gap-4 mt-4 sm:mt-0">
          {data.runners ? (
            data.runners.map((runner) => (
              <div
                key={runner.RunnerId}
                className="flex gap-2 justify-between sm:justify-start sm:text-base text-sm"
              >
                <div
                  className="bg-[#72bbef] sm:px-4 px-2 sm:py-2 py-1 text-black rounded text-center"
                  style={{ minWidth: "50px" }}
                >
                  {runner.Back?.Rate ?? "-"}
                </div>
                <div
                  className="bg-[#faa9ba] sm:px-4 px-2 sm:py-2 py-1 text-black rounded text-center"
                  style={{ minWidth: "50px" }}
                >
                  {runner.Lay?.Rate ?? "-"}
                </div>
              </div>
            ))
          ) : (
            <>
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-2 justify-between sm:justify-start sm:text-base text-sm"
                >
                  <div
                    className="bg-[#72bbef] sm:px-4 px-2 sm:py-2 py-1 text-black rounded text-center"
                    style={{ minWidth: "50px" }}
                  >
                    {"-"}
                  </div>
                  <div
                    className="bg-[#faa9ba] sm:px-4 px-2 sm:py-2 py-1 text-black rounded text-center"
                    style={{ minWidth: "50px" }}
                  >
                    {"-"}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
