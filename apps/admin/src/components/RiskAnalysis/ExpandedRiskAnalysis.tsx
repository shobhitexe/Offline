import fetcher from "@/lib/setup";
import { useSession } from "next-auth/react";
import useSWR from "swr";

type GroupedBetHistoryPerGame = {
  Bookmaker: Record<string, number>;
  Fancy: Record<string, number>;
  MatchOdds: Record<string, number>;
};

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
  const fancy = data?.data.Fancy || {};

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

      {/* <div>
        <h3 className="text-md font-semibold mb-2">Fancy</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(fancy).map((item) => (
            <div
              key={item}
              className="flex justify-between bg-gray-100 p-2 rounded shadow-sm"
            >
              <span className="font-medium text-gray-700">{item}</span>
              <span className="text-gray-900">{fancy[item]}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
