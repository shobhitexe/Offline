import { BetHistoryPerGame, GroupedBetHistoryPerGame, Market } from "@/types";
import { Button } from "@repo/ui";
import MarketTableComponent from "./MarketTable";
import FancyTableComponent from "./FancyTable";
import BetHistory from "../BetHistory";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";

export default function MatchTable({
  matchOdds,
  Bookmaker,
  Fancy,
  eventId,
  matchName,
  marketId,
  tabType,
}: {
  matchOdds: Market;
  Bookmaker: Market;
  Fancy: Market;
  eventId: string;
  matchName: string;
  marketId: string;
  tabType: string;
}) {
  const session = useSession();

  const { data, mutate } = useSWR<{
    data: { history: BetHistoryPerGame[]; grouped: GroupedBetHistoryPerGame };
  }>(
    `${BackendURL}/api/v1/sports/bethistory/pergame?userId=${session.data?.user.id}&eventId=${eventId}`,
    fetcher
  );

  return (
    <div className="flex flex-col gap-5 w-full relative">
      <div className="space-y-4 sm:text-base text-sm">
        {(tabType === "all" || tabType === "market") && (
          <div className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(5,60px)] gap-2">
            <div></div>
            <div className="col-span-3"></div>
            <Button
              variant="outline"
              className="bg-[#72bbef] text-black hover:bg-[#72bbef]/90"
              style={{ backgroundColor: "#72bbef" }}
            >
              Back
            </Button>
            <Button
              variant="outline"
              className="bg-[#faa9ba] text-black hover:bg-[#faa9ba]/90"
              style={{ backgroundColor: "#faa9ba" }}
            >
              Lay
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {(tabType === "all" || tabType === "market") && (
          <MarketTableComponent
            data={matchOdds}
            eventId={eventId}
            matchName={matchName}
            marketId={marketId}
            type="Match Odds"
            bets={data?.data.grouped["Match Odds"]}
          />
        )}

        {(tabType === "all" || tabType === "market") && <BreakLine />}

        {(tabType === "all" || tabType === "market") && Bookmaker && (
          <MarketTableComponent
            data={Bookmaker}
            eventId={eventId}
            matchName={matchName}
            marketId={marketId}
            type="Bookmaker"
            bets={data?.data.grouped.Bookmaker}
          />
        )}

        {tabType === "all" && Fancy && Fancy.runners.length !== 0 && (
          <BreakLine />
        )}

        {(tabType === "all" || tabType === "fancy") &&
          Fancy &&
          Fancy.runners.length !== 0 && (
            <div className="grid ss:grid-cols-[1fr_repeat(5,80px)] grid-cols-[1fr_repeat(5,60px)] gap-2 sm:text-base text-sm">
              <div></div>
              <div className="col-span-3"></div>
              <Button
                variant="outline"
                className="bg-[#faa9ba] text-black hover:bg-[#faa9ba]/90"
                style={{ backgroundColor: "#faa9ba" }}
              >
                No
              </Button>
              <Button
                variant="outline"
                className="bg-[#72bbef] text-black hover:bg-[#72bbef]/90"
                style={{ backgroundColor: "#72bbef" }}
              >
                Yes
              </Button>
            </div>
          )}

        {(tabType === "all" || tabType === "fancy") &&
          Fancy &&
          Fancy.runners.length !== 0 && (
            <FancyTableComponent
              data={Fancy}
              eventId={eventId}
              matchName={matchName}
              marketId={marketId}
              type="Fancy"
              bets={data?.data.grouped.Fancy}
            />
          )}
      </div>

      {data?.data.history && (
        <BetHistory data={data?.data.history} mutate={mutate} />
      )}
    </div>
  );
}

function BreakLine() {
  return <div className="h-px w-full bg-inputField my-5" />;
}