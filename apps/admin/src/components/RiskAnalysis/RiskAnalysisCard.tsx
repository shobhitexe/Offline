import { EventType, Market } from "@/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import ExpandedRiskAnalysis from "./ExpandedRiskAnalysis";
import fetcher from "@/lib/setup";
import useSWR from "swr";

export default function RiskAnalysisCard({
  event,
  expandedMatches,
  toggleMatch,
}: {
  event: EventType;
  expandedMatches: string[];
  toggleMatch: (id: string) => void;
}) {
  const { data } = useSWR<{ data: Market }>(
    `/sports/matchodds?eventId=${event.eventId}`,
    fetcher
  );

  return (
    <div key={event.eventId} className="border rounded-lg">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer"
        onClick={() => toggleMatch(event.eventId)}
      >
        <div className="flex items-center gap-2">
          <span className="w-6">
            {expandedMatches.includes(event.eventId) ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
          <div>
            <Link
              href={`/risk-analysis/details/${event.eventId}`}
              className="font-medium hover:underline"
            >
              {event.eventName}
            </Link>

            <div className="text-sm text-muted-foreground">
              {event.eventTime}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          {data?.data.runners &&
            data.data.runners.map((runner) => (
              <div
                key={runner.RunnerId}
                className="flex gap-2 justify-between sm:justify-start"
              >
                <div className="bg-sky-100 px-4 py-2 rounded w-full sm:w-auto text-center">
                  {runner.Back.Rate}
                </div>
                <div className="bg-pink-100 px-4 py-2 rounded w-full sm:w-auto text-center">
                  {runner.Lay.Rate}
                </div>
              </div>
            ))}
        </div>
      </div>
      {expandedMatches.includes(event.eventId) && event.MatchOdds && (
        <ExpandedRiskAnalysis eventId={event.eventId} />
      )}
    </div>
  );
}
