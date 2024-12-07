"use client";

import { RootState } from "@/store/root-reducer";
import { setStatementParams } from "@/store/slices/AccountStatement/statement-params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useDispatch, useSelector } from "react-redux";

export default function Transactiontype() {
  const dispatch = useDispatch();

  const statementParams = useSelector(
    (state: RootState) => state.statementParams
  );

  return (
    <Select
      onValueChange={(e) =>
        dispatch(setStatementParams({ ...statementParams, type: e }))
      }
    >
      <SelectTrigger className="max-w-sm">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All Transaction</SelectItem>

        {statementParams.statementType === "wallet" && (
          <>
            <SelectItem value="DepositsWithdraw">
              Deposits & Withdraw
            </SelectItem>
            <SelectItem value="Deposits">Deposits</SelectItem>
            <SelectItem value="Withdraw">Withdraw</SelectItem>
          </>
        )}

        {statementParams.statementType === "bet" && (
          <>
            <SelectItem value="BetsWins">Bets & Wins</SelectItem>
            <SelectItem value="Bets">Bets</SelectItem>
            <SelectItem value="Wins">Wins</SelectItem>
          </>
        )}

        {statementParams.statementType === "colorbet" && <></>}
      </SelectContent>
    </Select>
  );
}
