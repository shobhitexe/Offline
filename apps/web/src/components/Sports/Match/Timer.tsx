"use client";

import Countdown, { CountdownRenderProps } from "react-countdown";
import { Tv } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";

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
    <div className="bg-main text-white rounded-lg p-2 min-w-[300px] flex flex-col justify-center items-center">
      <h2 className="text-center text-sm mb-2">{eventName}</h2>

      <Countdown date={new Date(eventTime)} renderer={renderer} />

      <div className="flex items-center justify-between mt-2 text-center self-center">
        <div className="text-inputBg font-medium">
          {isToday(new Date(eventTime))
            ? "TODAY"
            : isTomorrow(new Date(eventTime))
              ? "TOMORROW"
              : format(new Date(eventTime), "eeee, dd MMM yyyy")}
          <span className="text-sm text-gray-100 ml-2">
            {format(new Date(eventTime), "hh:mm a")}
          </span>
        </div>
      </div>
    </div>
  );
}
