import fetcher from "@/lib/setup";
import useSWR from "swr";

type ActiveBetsByMarketId = {
  "Match Odds": Record<string, number>;
  Bookmaker: Record<string, number>;
  Fancy: Record<string, number>;
};

export default function ExpandedRiskAnalysis({
  eventId,
  marketId,
}: {
  eventId: string;
  marketId: string;
}) {
  const { data, isLoading, error } = useSWR<{ data: ActiveBetsByMarketId }>(
    `/admin/sports/list/activebets?eventId=${eventId}&marketId=${marketId}`,
    fetcher
  );

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Failed to fetch data</div>;
  }

  if (!data?.data || Object.keys(data.data).length === 0) {
    return <div className="p-4">No data available.</div>;
  }

  return (
    <div className="p-4 border-t w-full">
      {Object.entries(data.data).map(([category, teams]) => (
        <div
          key={category}
          className="border rounded-lg sm:mb-4 mb-1 flex sm:flex-row flex-col items-center justify-between"
        >
          <div className="flex justify-between items-center sm:p-4 p-2 bg-gray-100 rounded-t">
            <h3 className="font-semibold">{category}</h3>
          </div>

          <div className="sm:p-4 p-2">
            {Object.keys(teams).length === 0 ? (
              <p className="text-gray-500">No exposures in this category.</p>
            ) : (
              <div className="sm:flex grid grid-cols-2 w-full items-center gap-1">
                {Object.entries(teams).map(([team, exposure]) => (
                  <div
                    key={team}
                    className="flex sm:flex-row flex-col sm:gap-5 gap-1 justify-between items-center bg-white shadow-sm border rounded p-2"
                  >
                    <div className="font-medium">{team}</div>
                    <div
                      className={`font-bold ${
                        exposure >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {exposure}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
