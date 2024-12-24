"use client";

import { DashboardHeading, Statement, StatementColumns } from "@/components";
import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import {
  DataTable,
  DatePickerWithRange,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { addDays } from "date-fns";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import useSWR from "swr";

export default function AccountStatement() {
  const session = useSession();

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [gameType, setGameType] = useState<string | undefined>("all");
  const [marketType, setmarketType] = useState<string | undefined>("all");

  const { data } = useSWR<{ data: [] }>(
    `${BackendURL}/api/v1/user/statement?id=${session.data?.user.id}&from=${date?.from?.toISOString()}&to=${date?.to?.toISOString()}&gameType=${gameType}&marketType=${marketType}`,
    fetcher
  );

  return (
    <div className="w-[95%] mx-auto">
      <DashboardHeading heading={"Account Statement"} />

      <div className="flex flex-col gap-5 sm:py-10 py-5 sm:px-5 px-3 rounded-xl mt-5 bg-cardBG text-black">
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
        <DataTable columns={StatementColumns} data={data?.data || []} />
      </div>
    </div>
  );
}
