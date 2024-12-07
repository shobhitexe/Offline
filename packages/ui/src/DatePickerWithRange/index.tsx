"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "../lib/utils";
import { Button } from "../Button";
import { CalendarWhite } from "../CalenderWhite";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { useState } from "react";
import { Calendar } from "../Calender";

export function DatePickerWithRange({
  className,
  date,
  setDate,
  varient = "white",
}: {
  className?: string;
  date?: DateRange | undefined;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  varient?: "white" | "brown";
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("ui-grid ui-gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            // variant={"brown"}
            variant={varient === "white" ? "outline" : "default"}
            className={cn(
              `ui-w-[250px] ui-justify-start ui-text-left ${varient === "white" ? "ui-text-black" : "ui-text-white"} py-2 ui-font-normal ${varient === "brown" && "ui-border ui-border-[#483B32]"}`,
              !date && "ui-text-muted-foreground"
            )}
          >
            <CalendarIcon className="ui-mr-2 ui-h-4 ui-w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`ui-w-auto ui-p-0 ${varient === "white" && "ui-bg-white"} ui-flex ui-flex-col ui-items-center gap-5`}
          align="start"
        >
          {varient === "white" && (
            <CalendarWhite
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          )}

          {varient === "brown" && (
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          )}
          <Button
            variant={varient === "brown" ? "outline" : "default"}
            className="ui-mx-auto ui-w-fit ui-text-black"
            onClick={() => setIsOpen(false)}
          >
            Apply
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
