import { EventType } from "@/types";

export default function GameCard({
  matchName,
  eventId,
  matchType,
  openingTime,
}: {
  matchName: string;
  eventId: string;
  matchType: string;
  openingTime: string;
}) {
  return (
    <div className="py-5">
      <div>
        <div className="text-sm">{matchName}</div>
        <div className="text-xs">{matchType}</div>
      </div>
    </div>
  );
}
