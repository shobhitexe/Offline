"use client";

import Betslip from "./Betslip";

export default function AllCricket({ info }: { info: SportsData }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <div>Match Odds</div>
        <hr />
        <div className="flex flex-col gap-5 w-full">
          {info.data.MatchOdds.runners.map((item) => (
            <div
              key={item.RunnerId}
              className="flex items-center justify-between"
            >
              <div>{item.RunnerName}</div>
              <div>
                Back:{" "}
                <Betslip
                  rate={item.Back.Rate}
                  price={item.Back.Price}
                  betType="back"
                  matchId={info.data.EventId}
                  marketName={info.data.MatchOdds.MarketName}
                  marketId={info.data.MatchOdds.MarketId}
                  runnerName={item.RunnerName}
                  runnerID={item.RunnerId}
                />
              </div>
              <div>
                Lay:{" "}
                <Betslip
                  rate={item.Lay.Rate}
                  price={item.Lay.Price}
                  betType="lay"
                  matchId={info.data.EventId}
                  marketName={info.data.MatchOdds.MarketName}
                  marketId={info.data.MatchOdds.MarketId}
                  runnerName={item.RunnerName}
                  runnerID={item.RunnerId}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>BookMaker</div>
        <hr />
        <div className="flex flex-col gap-5 w-full">
          {info.data.BookMaker.runners.map((item) => (
            <div
              key={item.RunnerId}
              className="flex items-center justify-between"
            >
              <div>{item.RunnerName}</div>
              <div>
                Back:
                <Betslip
                  rate={item.Back.Rate}
                  price={item.Back.Price}
                  betType="back"
                  matchId={info.data.EventId}
                  marketName={info.data.BookMaker.MarketName}
                  marketId={info.data.BookMaker.MarketId}
                  runnerName={item.RunnerName}
                  runnerID={item.RunnerId}
                />
              </div>
              <div>
                Lay:
                <Betslip
                  rate={item.Lay.Rate}
                  price={item.Lay.Price}
                  betType="lay"
                  matchId={info.data.EventId}
                  marketName={info.data.BookMaker.MarketName}
                  marketId={info.data.BookMaker.MarketId}
                  runnerName={item.RunnerName}
                  runnerID={item.RunnerId}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
