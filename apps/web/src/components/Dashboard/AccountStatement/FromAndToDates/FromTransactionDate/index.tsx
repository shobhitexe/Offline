"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  Calendar,
  Button,
} from "@repo/ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";
import { setStatementParams } from "@/store/slices/AccountStatement/statement-params";

export function FromTransactiondate() {
  const dispatch = useDispatch();

  const statementParams = useSelector(
    (state: RootState) => state.statementParams
  );

  const startDate = statementParams.startDate
    ? new Date(statementParams.startDate)
    : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "xs:w-[280px] w-full justify-start text-left font-normal flex items-center pl-5 border border-[#483B32]",
            !statementParams.startDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {statementParams.startDate ? (
            format(statementParams.startDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={startDate}
          onSelect={(e) =>
            dispatch(
              setStatementParams({
                ...statementParams,
                startDate: e ? e.toISOString() : "",
              })
            )
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
