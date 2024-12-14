import fetcher from "@/lib/setup";
import { GroupedBetHistoryPerGame } from "@repo/types";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function ExpandedRiskAnalysis({ eventId }: { eventId: string }) {
  const session = useSession();

  const { data, isLoading, error } = useSWR<{ data: GroupedBetHistoryPerGame }>(
    `/admin/sports/list/activebets?eventId=${eventId}`,
    fetcher
  );

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">Failed to fetch data</div>
    );
  }

  function reverseSign(num: number) {
    return -num;
  }

  const matchOdds = data?.data.MatchOdds || {};
  const bookmaker = data?.data.Bookmaker || {};
  const fancy = data?.data.Fancy || [];

  return (
    <div className="p-4 border-t w-full text-sm">
      {Object.keys(matchOdds).length === 0 &&
        Object.keys(bookmaker).length === 0 && (
          <h2 className="text-base font-bold mb-4">No Data yet</h2>
        )}
      {Object.keys(matchOdds).length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Match Odds</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(matchOdds).map((item) => (
              <div
                key={item}
                className={`flex justify-between p-2 text-white rounded border shadow-sm`}
              >
                <span className="font-medium text-black">{item}</span>
                <span
                  className={`${reverseSign(matchOdds[item]) >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {(
                    reverseSign(matchOdds[item]) *
                    (session.data?.user.sportsShare! / 100)
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {Object.keys(bookmaker).length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Bookmaker</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(bookmaker).map((item) => (
              <div
                key={item}
                className={`flex justify-between p-2 text-white rounded border shadow-sm`}
              >
                <span className="font-medium text-black">{item}</span>
                <span
                  className={`${reverseSign(bookmaker[item]) >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {(
                    reverseSign(bookmaker[item]) *
                    (session.data?.user.sportsShare! / 100)
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Fancy</h3>

        <div className="flex flex-wrap items-center gap-5">
          {fancy.map((item) => (
            <div key={item.RunnerName}>
              <div className="text-center">
                {item.RunnerName} ({item.BetType})
              </div>
              <table>
                <tbody>
                  <tr className="border">
                    {Array.from({ length: 11 }, (_, i) => {
                      const offset = i - 5;
                      return (
                        <th key={offset} className="border border-black p-1">
                          {item.OddsRate + offset}
                        </th>
                      );
                    })}
                  </tr>

                  <tr>
                    {Array.from({ length: 11 }, (_, i) => {
                      const isNegative = item.BetType === "no" ? i < 5 : i > 5;
                      return (
                        <td
                          key={i}
                          className={`border border-black p-1 ${isNegative ? "text-red-600" : "text-green-600"}`}
                        >
                          {isNegative
                            ? -`${item.TotalExposure}`
                            : item.TotalProfit}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
