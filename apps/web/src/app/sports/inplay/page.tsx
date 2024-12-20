import { GameCard } from "@/components";
import { BackendURL } from "@/config/env";
import { EventType } from "@/types";

async function getData() {
  try {
    const res = await fetch(`${BackendURL}/api/v1/sports/inplay`);

    if (res.status !== 200) {
      return [];
    }

    const _res = await res.json();
    return _res.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default async function page() {
  const data: {
    cricket: EventType[];
    tennis: EventType[];
    football: EventType[];
  } = await getData();

  return (
    <div className="flex flex-col gap-5 text-main min-h-screen">
      {data.cricket && (
        <div>
          <div className="flex flex-col divide-y divide-inputField">
            {data.cricket.map((item) => (
              <GameCard key={item.eventId} event={item} />
            ))}
          </div>
        </div>
      )}
      {data.tennis && (
        <div>
          <div className="bg-[#444446] h-1 w-full mt-3" />

          <div className="flex flex-col divide-y divide-inputField">
            {data.tennis.map((item) => (
              <GameCard key={item.eventId} event={item} />
            ))}
          </div>
        </div>
      )}
      {data.football && (
        <div>
          <div className="flex flex-col divide-y divide-inputField">
            {data.football.map((item) => (
              <GameCard key={item.eventId} event={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
