import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Flag } from "lucide-react";
import Link from "next/link";

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
    <Link href={`/cricket/info/${eventId}`}>
      <Card className="w-full max-w-md">
        <CardHeader></CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">{matchName}</h3>
          <p className="text-sm text-muted-foreground mb-4">{matchType}</p>
          <p className="text-sm mb-4">{openingTime}</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </Link>
  );
}
