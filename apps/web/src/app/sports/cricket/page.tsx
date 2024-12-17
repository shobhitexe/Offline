import { GameCard } from "@/components";
import { BackendURL } from "@/config/env";
import { EventType } from "@/types";

async function getData() {
  try {
    const res = await fetch(`${BackendURL}/api/v1/sports/getActiveEvents?id=4`);

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
  const data: EventType[] = await getData();

  return (
    <div>
      <div className="text-lg font-bold">Cricket</div>

      <div>Featured Matches</div>

      <div className="bg-[#444446] h-1 w-full mt-3" />

      <div className="flex flex-col divide-y divide-[#444446]">
        {data.map((item) => (
          <GameCard key={item.eventTime} event={item} />
        ))}
      </div>
    </div>
  );
}
