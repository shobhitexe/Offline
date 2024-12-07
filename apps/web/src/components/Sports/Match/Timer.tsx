"use client";

import Countdown from "react-countdown";

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

        <Countdown
          date={new Date(eventTime)}
          renderer={({ days, hours, minutes, seconds }) => (
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
          )}
        />
      </div>
    </div>
  );
}
