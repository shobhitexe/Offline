"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Save } from "lucide-react";

export const tournamentSettingsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index}</div>,
  },
  {
    accessorKey: "tournamentName",
    header: "Tournament Name",
  },
  {
    accessorKey: "premoStakes",
    header: "Pre MO stakes",
  },
  {
    accessorKey: "postmoStakes",
    header: "Post MO stakes",
  },
  {
    accessorKey: "preBMStakes",
    header: "Pre BM stakes",
  },
  {
    accessorKey: "postBMStakes",
    header: "Post BM stakes",
  },
  {
    accessorKey: "preFancyStakes",
    header: "Pre Fancy stakes",
  },
  {
    accessorKey: "postFancyStakes",
    header: "Post Fancy stakes",
  },
  {
    accessorKey: "tossStake",
    header: "Toss stakes",
  },
  {
    accessorKey: "betDelay",
    header: "Bet Delay",
  },
  {
    accessorKey: "maxProfit",
    header: "Max Profit",
  },
  {
    accessorKey: "maxOdds",
    header: "Max Odds",
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
