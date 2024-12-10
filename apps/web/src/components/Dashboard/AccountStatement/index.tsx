"use client";

import { FromAndToDates, Transactiontype } from "@/components";
import { fetchAccountStatement } from "@/lib/apis/wallet";
import { RootState } from "@/store/root-reducer";
import { setBetTableData } from "@/store/slices/AccountStatement/bet-table-data";
import { setColorBetTableData } from "@/store/slices/AccountStatement/colorbet-table-data";
import { setWalletTableData } from "@/store/slices/AccountStatement/wallet-table-data";
import { Button, Label, useToast } from "@repo/ui";
import { useSession } from "next-auth/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Statement() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const session = useSession();

  const statementParams = useSelector(
    (state: RootState) => state.statementParams
  );

  return (
    <div className="flex flex-wrap md:items-end items-center sm:gap-5 gap-3">
      <div className="grid w-full items-center gap-1.5 max-w-sm">
        <Label>Transaction Type</Label>
        <Transactiontype />
      </div>
      <FromAndToDates />
      <Button
        size={"xl"}
        className="ui-py-2"
        onClick={async () => {
          if (statementParams.type === "") {
            toast({
              variant: "destructive",
              description: "Please select Transaction type",
            });
            return;
          }

          if (statementParams.startDate === "") {
            toast({
              variant: "destructive",
              description: "Please select Start date",
            });
            return;
          }

          if (statementParams.endDate === "") {
            toast({
              variant: "destructive",
              description: "Please select End date",
            });
            return;
          }

          const res = await fetchAccountStatement(
            session.data?.user.id!,
            statementParams.type,
            statementParams.startDate,
            statementParams.endDate,
            statementParams.statementType
          );

          if (statementParams.statementType === "bet") {
            dispatch(setBetTableData(res));
          }
          if (statementParams.statementType === "wallet") {
            dispatch(setWalletTableData(res));
          }
          if (statementParams.statementType === "colorbet") {
            dispatch(setColorBetTableData(res));
          }
        }}
      >
        Search
      </Button>
    </div>
  );
}
