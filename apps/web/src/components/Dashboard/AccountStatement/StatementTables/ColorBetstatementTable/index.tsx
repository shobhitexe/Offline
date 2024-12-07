"use client";

import { DataTable } from "@repo/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";
import { ColorBetstatementColumn } from "./ColorBetStatementColumns";

export default function BetStatementTable() {
  const betTableData = useSelector(
    (state: RootState) => state.colorBetTabledata
  );

  return (
    <DataTable
      columns={ColorBetstatementColumn}
      data={betTableData}
      isSearch={false}
      varient="brown"
    />
  );
}
