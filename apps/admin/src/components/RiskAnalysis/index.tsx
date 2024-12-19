"use client";

import { useState } from "react";
import { EventType } from "@/types";
import RiskAnalysisCard from "./RiskAnalysisCard";

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
            <RiskAnalysisCard
              event={event}
              expandedMatches={expandedMatches}
              toggleMatch={toggleMatch}
              key={event.eventId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
