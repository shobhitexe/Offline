"use client";

import { ColumnDef } from "@tanstack/react-table";

export const betHistoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "selection",
    header: "Selection",
    cell: ({ row }) => (
      <div>
        {row.getValue("selection")} ({row.getValue("betType")})
      </div>
    ),
  },
  {
    accessorKey: "betType",
    header: "",
    cell: () => <></>,
  },
  {
    accessorKey: "odds",
    header: "Odds",
  },
  {
    accessorKey: "stake",
    header: "Stake",
  },
  {
    accessorKey: "pnl",
    header: "P/L",
  },
];
