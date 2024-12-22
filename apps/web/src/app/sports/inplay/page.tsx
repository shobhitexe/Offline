import { GameCard } from "@/components";
import { BackendURL } from "@/config/env";
import { EventType } from "@/types";
import { ReactNode } from "react";

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
    <div className="flex flex-col text-main min-h-screen">
      {data.cricket && (
        <div>
          <Title>Cricket</Title>
          <div className="flex flex-col divide-y divide-inputField">
            {data.cricket.map((item) => (
              <GameCard key={item.eventId} event={item} isInPlay={true} />
            ))}
          </div>
        </div>
      )}
      {data.tennis && (
        <div>
          <Title>Tennis</Title>
          <div className="flex flex-col divide-y divide-inputField">
            {data.tennis.map((item) => (
              <GameCard key={item.eventId} event={item} isInPlay={true} />
            ))}
          </div>
        </div>
      )}
      {data.football && (
        <div>
          <Title>Football</Title>
          <div className="flex flex-col divide-y divide-inputField">
            {data.football.map((item) => (
              <GameCard key={item.eventId} event={item} isInPlay={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <div className="bg-main text-sm text-inputField p-2 font-semibold rounded-sm uppercase">
      {children}
    </div>
  );
}
