import { Card, CardContent } from "@repo/ui";
import { format, isToday, isTomorrow } from "date-fns";

export default function MatchInfo({
  matchTime,
  firstTeam,
  secondTeam,
}: {
  matchTime: string;
  firstTeam: string;
  secondTeam: string;
}) {
  return (
    <Card className="pt-20 bg-white">
      <CardContent className="sm:ui-p-6 ui-p-2 flex flex-col items-stretch justify-between w-full">
        <div className="flex ss:flex-row flex-col items-center justify-between sm:gap-5 gap-1">
          <div className="flex items-center max-ss:justify-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold">
              {firstTeam.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-lg">{firstTeam}</div>
          </div>
          <div className="text-lg font-bold max-ss:text-center">VS</div>
          <div className="flex items-center gap-4 max-ss:justify-center">
            <div className="text-lg">{secondTeam}</div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold">
              {secondTeam.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between my-4 text-center self-center">
          <div className="text-purple-700 font-medium">
            {isToday(new Date(matchTime))
              ? "TODAY"
              : isTomorrow(new Date(matchTime))
                ? "TOMORROW"
                : format(new Date(matchTime), "eeee, dd MMM yyyy")}
            <span className="text-sm text-gray-600 ml-2">
              {format(new Date(matchTime), "hh:mm a")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
