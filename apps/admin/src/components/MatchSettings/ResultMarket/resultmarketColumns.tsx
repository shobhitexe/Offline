"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Save } from "lucide-react";

export const resultMarketColumns: ColumnDef<any>[] = [
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
    accessorKey: "marketName",
    header: "Market Name",
  },
  {
    accessorKey: "matchTime",
    header: "Match Time",
  },
  {
    accessorKey: "runners",
    header: "Runners",
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
