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
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-lg font-bold">Cricket</div>
        <div>In Play</div>
        <div className="bg-[#444446] h-1 w-full mt-3" />

        <div className="flex flex-col divide-y divide-[#444446]">
          {data.cricket.map((item) => (
            <GameCard key={item.eventId} {...item} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-lg font-bold">Tennis</div>

        <div>In Play</div>

        <div className="bg-[#444446] h-1 w-full mt-3" />

        <div className="flex flex-col divide-y divide-[#444446]">
          {data.tennis.map((item) => (
            <GameCard key={item.eventId} {...item} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-lg font-bold">Football</div>

        <div>In Play</div>

        <div className="bg-[#444446] h-1 w-full mt-3" />

        <div className="flex flex-col divide-y divide-[#444446]">
          {data.football.map((item) => (
            <GameCard key={item.eventId} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
