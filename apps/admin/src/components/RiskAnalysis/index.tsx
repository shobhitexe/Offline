"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { EventType } from "@/types";
import ExpandedRiskAnalysis from "./ExpandedRiskAnalysis";
import Link from "next/link";

export default function RiskAnalysis({
  events,
  heading,
}: {
  events: EventType[];
  heading: string;
}) {
  const [expandedMatches, setExpandedMatches] = useState<string[]>([]);

  const toggleMatch = (id: string) => {
    setExpandedMatches((prev) =>
      prev.includes(id)
        ? prev.filter((matchId) => matchId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{heading}</h2>
          {events.map((event) => (
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
                      {new Date(event.eventTime).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
                  {event.MatchOdds.runners &&
                    event.MatchOdds.runners.map((runner) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
