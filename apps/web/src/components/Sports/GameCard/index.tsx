import Link from "next/link";

export default function GameCard({
  eventName,
  eventId,
  eventTime,
}: {
  eventName: string;
  eventId: string;
  eventTime: string;
}) {
  return (
    <Link href={`/sports/match/${eventId}/all`} className="py-5 cursor-pointer">
      <div>
        <div className="text-sm">{eventName}</div>
        <div className="text-xs">{eventTime}</div>
      </div>
    </Link>
  );
}
