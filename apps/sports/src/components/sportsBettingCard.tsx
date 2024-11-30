import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Flag } from "lucide-react";

interface Runner {
  selectionId: number;
  runnerName: string;
  handicap: number;
  sortPriority: number;
}

interface SportsBettingCardProps {
  competition: { id: string; name: string };
  event: {
    countryCode: string;
    id: string;
    name: string;
    openDate: string;
  };
  eventType: { id: string; name: string };
  marketId: string;
  marketName: string;
  marketStartTime: string;
  runners: Runner[];
  totalMatched: number;
}

export default function SportsBettingCard({
  competition,
  event,
  eventType,
  marketName,
  marketStartTime,
  runners,
  totalMatched,
}: SportsBettingCardProps) {
  const formattedDate = new Date(marketStartTime).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{eventType.name}</span>
          <span className="flex items-center text-sm font-normal">
            <Flag className="mr-1 h-4 w-4" />
            {event.countryCode}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{competition.name}</p>
        <p className="text-sm mb-4">{formattedDate}</p>
        <div className="grid grid-cols-3 gap-2">
          {runners.map((runner) => (
            <Button
              key={runner.selectionId}
              variant="outline"
              className="w-full"
            >
              {runner.runnerName}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {marketName} • Total Matched: {totalMatched}
        </p>
      </CardFooter>
    </Card>
  );
}
