"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import WalletStatementTable from "./WalletStatementTable";
import BetStatementTable from "./BetStatementTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";
import { setStatementParams } from "@/store/slices/AccountStatement/statement-params";
import ColorBetStatementTable from "./ColorBetstatementTable";

export default function StatementTables() {
  const dispatch = useDispatch();

  const statementparams = useSelector(
    (state: RootState) => state.statementParams
  );

  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  return (
    <Tabs
      defaultValue="wallet"
      className="w-full"
      onValueChange={(e) => {
        dispatch(
          setStatementParams({
            ...statementparams,
            statementType: e as "wallet" | "bet" | "colorbet",
          })
        );
      }}
    >
      <TabsList>
        <TabsTrigger value="wallet">Wallet</TabsTrigger>
        <TabsTrigger value="bet">Bet</TabsTrigger>
        {casinoName === "jackpot1x" && (
          <TabsTrigger value="colorbet">Color Bet</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="wallet">
        <WalletStatementTable />
      </TabsContent>
      <TabsContent value="bet">
        <BetStatementTable />
      </TabsContent>
      <TabsContent value="colorbet">
        <ColorBetStatementTable />
      </TabsContent>
    </Tabs>
  );
}
