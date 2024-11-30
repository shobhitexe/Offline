import SportsBettingCard from "@/components/sportsBettingCard";

interface Runner {
  selectionId: number;
  runnerName: string;
  handicap: number;
  sortPriority: number;
}

interface SportsBettingCardProps {
  competition: { id: string; name: string };
  event: {
    countryCode: string;
    id: string;
    name: string;
    openDate: string;
  };
  eventType: { id: string; name: string };
  marketId: string;
  marketName: string;
  marketStartTime: string;
  runners: Runner[];
  totalMatched: number;
}

async function getData(id: string) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/sports/listEvents?sportsId=1&competitionId=${id}`
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

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data: SportsBettingCardProps[] = await getData(id);

  return (
    <div className="flex items-center flex-wrap justify-center gap-5">
      {data.map((item) => (
        <SportsBettingCard key={item.marketId} {...item} />
      ))}
    </div>
  );
}
