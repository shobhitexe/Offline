"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../lib/utils";
import { buttonVariants } from "../Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("ui-bg-[#1E1E1E]", className)}
      classNames={{
        months:
          "ui-flex ui-flex-col sm:ui-flex-row ui-space-y-4 sm:ui-space-x-4 sm:ui-space-y-0",
        month: "ui-space-y-4",
        caption:
          "ui-flex ui-justify-center ui-pt-1 ui-relative ui-items-center",
        caption_label: "ui-text-sm ui-font-medium",
        nav: "ui-space-x-1 ui-flex ui-items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "ui-h-7 ui-w-7 ui-bg-transparent ui-p-0 ui-opacity-50 hover:ui-opacity-100"
        ),
        nav_button_previous: "ui-absolute ui-left-1",
        nav_button_next: "ui-absolute ui-right-1",
        table: "ui-w-full ui-border-collapse ui-space-y-1",
        head_row: "ui-flex",
        head_cell:
          "ui-text-muted-[#1E1E1E] ui-rounded-md ui-w-9 ui-font-normal ui-text-[0.8rem]",
        row: "ui-flex ui-w-full ui-mt-2",
        cell: "ui-h-9 ui-w-9 ui-text-center ui-text-sm ui-p-0 ui-relative [&:has([aria-selected].day-range-end)]:ui-rounded-r-md [&:has([aria-selected].day-outside)]:ui-bg-[#1E1E1E] [&:has([aria-selected])]:ui-bg-[#1E1E1E] first:[&:has([aria-selected])]:ui-rounded-l-md last:[&:has([aria-selected])]:ui-rounded-r-md focus-within:ui-relative focus-within:ui-z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "ui-h-9 ui-w-9 ui-p-0 ui-font-normal aria-selected:ui-opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "ui-bg-primary ui-text-primary-[#1E1E1E] hover:ui-bg-primary hover:ui-text-primary-[#1E1E1E] focus:ui-bg-[#352F27] focus:ui-text-primary-[#1E1E1E]",
        day_today: "ui-bg-black ui-text-accent-[#1E1E1E]",
        day_outside:
          "day-outside ui-text-muted-[#1E1E1E] ui-opacity-50 aria-selected:ui-bg-[#1E1E1E] aria-selected:ui-text-muted-[#1E1E1E] aria-selected:ui-opacity-30",
        day_disabled: "ui-text-muted-[#1E1E1E] ui-opacity-50",
        day_range_middle:
          "aria-selected:ui-bg-black aria-selected:ui-text-accent-[#1E1E1E]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={
        {
          // IconLeft: ({ ...props }) => <ChevronLeft className="ui-h-4 ui-w-4" />,
          // IconRight: ({ ...props }) => <ChevronRight className="ui-h-4 ui-w-4" />,
        }
      }
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
