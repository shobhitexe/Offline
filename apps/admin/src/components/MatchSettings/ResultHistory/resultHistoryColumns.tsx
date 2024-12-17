"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Save } from "lucide-react";

export const resultMarketHistoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index}</div>,
  },
  {
    accessorKey: "matchName",
    header: "Match Name",
  },
  {
    accessorKey: "result",
    header: "Result",
  },
  {
    accessorKey: "settlementTime",
    header: "Settlement Time",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        <CircleCheck />
      </div>
    ),
  },
];
