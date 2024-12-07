"use client";

import { DatePickerWithRange } from "@repo/ui";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setStatementParams } from "@/store/slices/AccountStatement/statement-params";
import { RootState } from "@/store/root-reducer";

export default function FromAndToDates() {
  const dispatch = useDispatch();

  const statementParams = useSelector(
    (state: RootState) => state.statementParams
  );

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  useEffect(() => {
    dispatch(
      setStatementParams({
        ...statementParams,
        startDate: date?.from ? date.from.toISOString() : "",
        endDate: date?.to ? date?.to.toISOString() : "",
      })
    );
  }, [date]);

  return (
    <div className="flex items-center sm:gap-5 gap-3 max-md:flex-wrap max-xs:w-full">
      {/* <div className="grid w-full items-center gap-1.5 max-w-sm">
        <Label>From date</Label>
        <FromTransactiondate />
      </div>

      <div className="grid w-full items-center gap-1.5 max-w-sm">
        <Label>To date</Label>
        <ToTransactiondate />
      </div> */}

      <DatePickerWithRange date={date} setDate={setDate} varient="brown" />
    </div>
  );
}
