import SportsBettingCard from "./sportsBettingCard";

type EventType = {
  matchName: string;
  eventId: string;
  matchType: string;
  openingTime: string;
};

async function getData() {
  try {
    const res = await fetch(
      "http://localhost:8080/api/v1/sports/getActiveEvents?id=4"
    );

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

export default async function CricketComponentV2() {
  const data: EventType[] = await getData();

  return (
    <div className="flex flex-wrap">
      {data.map((item) => (
        <SportsBettingCard key={item.eventId} {...item} />
      ))}
    </div>
  );
}
