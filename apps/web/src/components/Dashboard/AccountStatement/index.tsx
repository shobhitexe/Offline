"use client";

import { buttonVariants, DatePickerWithRange } from "@repo/ui";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { RefreshCwIcon } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

export default function RefreshButton() {
  const router = useRouter();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [gameType, setGameType] = useState<string | undefined>("all");
  const [marketType, setmarketType] = useState<string | undefined>("all");

  useEffect(() => {
    const startDate = startOfDay(date?.from || new Date());
    const endDate = endOfDay(date?.to || new Date());

    let query = `?from=${new Date(startDate).toISOString()}&to=${new Date(endDate).toISOString()}`;
    if (gameType) {
      query += `&gameType=${gameType}`;
    }

    if (marketType) {
      query += `&marketType=${marketType}`;
    }

    router.push(query);
  }, [date, gameType, marketType, router]);

  return (
    <div className="flex sm:flex-row flex-col sm:items-center sm:gap-5 gap-2 text-white">
      <DatePickerWithRange date={date} setDate={setDate} varient="main" />

      <Select
        value={gameType}
        onValueChange={(e) => setGameType(e)}
        defaultValue="all"
      >
        <SelectTrigger className="max-w-[180px] ui-bg-main">
          <SelectValue placeholder="Game" defaultValue={"all"} />
        </SelectTrigger>
        <SelectContent className="ui-bg-main">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="4">Cricket</SelectItem>
          <SelectItem value="2">Tennis</SelectItem>
          <SelectItem value="1">Football</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={marketType}
        onValueChange={(e) => setmarketType(e)}
        defaultValue="all"
      >
        <SelectTrigger className="max-w-[180px] ui-bg-main">
          <SelectValue placeholder="market" defaultValue={"all"} />
        </SelectTrigger>
        <SelectContent className="ui-bg-main">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Match Odds">Match Odds</SelectItem>
          <SelectItem value="Bookmaker">Bookmaker</SelectItem>
          <SelectItem value="Fancy">Fancy</SelectItem>
        </SelectContent>
      </Select>
      {/* 
      <div
        className={buttonVariants({
          variant: "default",
          className: "cursor-pointer flex items-center gap-2 text-white",
        })}
      >
        Load <RefreshCwIcon className="w-4 h-4 dark:stroke-white" />
      </div> */}
    </div>
  );
}
