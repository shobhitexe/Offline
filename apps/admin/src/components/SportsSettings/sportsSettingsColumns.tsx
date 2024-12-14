"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Save } from "lucide-react";

export const sportsSettingsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index}</div>,
  },
  {
    accessorKey: "sportName",
    header: "Sport Name",
  },
  {
    accessorKey: "maxStake",
    header: "Max stake",
  },
  {
    accessorKey: "beforeInPlayMaxStake",
    header: "Before In Play Max stake",
  },
  {
    accessorKey: "beforeInPlayMinStake",
    header: "Before In Play Min stake",
  },
  {
    accessorKey: "maxOdds",
    header: "Max Odds",
  },
  {
    accessorKey: "betDelay",
    header: "Bet Delay",
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
