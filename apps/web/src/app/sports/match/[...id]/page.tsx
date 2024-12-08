import { MatchInfo, MatchTable, MatchTabs, Timer } from "@/components";
import { SportsData } from "@/types";

async function getInfo(id: string) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/sports/getEventDetail?eventId=${id}`
    );

    if (res.status !== 200) {
      return null;
    }

    const _res = await res.json();

    return _res.data;
  } catch (error) {
    return null;
  }
}

export default async function Match({ params }: { params: { id: string[] } }) {
  const info: SportsData = await getInfo(params.id[0]);

  return (
    <div className="w-full mx-auto sm:p-4 p-2 space-y-6">
      <Timer eventName={info.EventName} eventTime={info.EventTime} />

      <MatchInfo
        matchTime={info.EventTime}
        firstTeam={info.MatchOdds.runners[0].RunnerName}
        secondTeam={info.MatchOdds.runners[1].RunnerName}
      />

      <MatchTabs />

      <MatchTable
        matchOdds={info.MatchOdds}
        Bookmaker={info.BookMaker}
        Fancy={info.Fancy}
        eventId={info.EventId}
        matchName={info.EventName}
        marketId={info.MatchOdds.MarketId}
        tabType={params.id[1]}
      />
    </div>
  );
}
