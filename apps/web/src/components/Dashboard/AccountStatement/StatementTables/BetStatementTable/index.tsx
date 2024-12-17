"use client";

import { DataTable } from "@repo/ui";
import { BetStatementColumns } from "./BetStatementColumns";
import { useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";

export default function BetStatementTable() {
  const betTableData = useSelector((state: RootState) => state.betTableData);

  return (
    <DataTable
      columns={BetStatementColumns}
      data={betTableData}
      // isSearch={false}
      // varient="brown"
    />
  );
}
