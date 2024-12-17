"use client";

import Countdown, { CountdownRenderProps } from "react-countdown";
import { Tv } from "lucide-react";

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: CountdownRenderProps) => {
  if (completed) {
    return (
      <div className="flex items-center gap-2 justify-center font-semibold">
        LIVE <Tv className="w-4 h-4 -top-px relative" />
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-xl">{days}</div>
          <div className="text-xs">Days</div>
        </div>
        <div>
          <div className="text-xl">{hours}</div>
          <div className="text-xs">Hours</div>
        </div>
        <div>
          <div className="text-xl">{minutes}</div>
          <div className="text-xs">Min</div>
        </div>
        <div>
          <div className="text-xl">{seconds}</div>
          <div className="text-xs">Sec</div>
        </div>
      </div>
    );
  }
};

export default function Timer({
  eventName,
  eventTime,
}: {
  eventName: string;
  eventTime: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 -top-4 bg-[#1a1f4d] text-white rounded-lg p-4 min-w-[300px]">
        <h2 className="text-center text-sm mb-2">{eventName}</h2>

        <Countdown date={new Date(eventTime)} renderer={renderer} />
      </div>
    </div>
  );
}
