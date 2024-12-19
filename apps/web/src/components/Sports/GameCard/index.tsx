import { BackendURL } from "@/config/env";
import { EventType, Market } from "@/types";
import Link from "next/link";

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
    <Link href={`/sports/match/${event.eventId}`} className="sm:py-5 py-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:p-4 p-2 cursor-pointer">
        <div className="flex flex-col gap-1">
          <span className="font-medium hover:underline">{event.eventName}</span>
          <div className="text-sm text-muted-foreground">{event.category}</div>
          <div className="text-sm text-muted-foreground">{event.eventTime}</div>
        </div>
        <div className="sm:flex grid grid-cols-3 gap-4 mt-4 sm:mt-0">
          {data.runners &&
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
            ))}
        </div>
      </div>
    </Link>
  );
}
