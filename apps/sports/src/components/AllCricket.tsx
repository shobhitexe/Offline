"use client";

import { Button } from "@repo/ui";
import Betslip from "./Betslip";

export default function AllCricket({ info }: { info: SportsData }) {
  console.log(info.data.MatchOdds.runners);

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
                />
              </div>
              <div>
                Lay:{" "}
                <Betslip
                  rate={item.Lay.Rate}
                  price={item.Lay.Price}
                  betType="lay"
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
                />
              </div>
              <div>
                Lay:
                <Betslip
                  rate={item.Lay.Rate}
                  price={item.Lay.Price}
                  betType="lay"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
