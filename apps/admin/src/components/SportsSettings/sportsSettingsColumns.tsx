"use client";

import { Input } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Save } from "lucide-react";

export const sportsSettingsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index}</div>,
  },
  {
    accessorKey: "name",
    header: "Sport Name",
  },
  {
    accessorKey: "maxStake",
    header: "Max stake",
    cell: () => (
      <form className="cursor-pointer flex items-center gap-4 w-full">
        <Input
          name="run"
          type="number"
          id="run"
          placeholder={"Max Stake"}
          className="min-w-[80px]"
        />{" "}
      </form>
    ),
  },
  {
    accessorKey: "beforeInPlayMaxStake",
    header: "Before In Play Max stake",
    cell: () => (
      <form className="cursor-pointer flex items-center gap-4 w-full">
        <Input
          name="run"
          type="number"
          id="run"
          placeholder={"Before In Play Max stake"}
          className="min-w-[80px]"
        />{" "}
      </form>
    ),
  },
  {
    accessorKey: "beforeInPlayMinStake",
    header: "Before In Play Min stake",
    cell: () => (
      <form className="cursor-pointer flex items-center gap-4 w-full">
        <Input
          name="run"
          type="number"
          id="run"
          placeholder={"Before In Play Min stake"}
          className="min-w-[80px]"
        />{" "}
      </form>
    ),
  },
  {
    accessorKey: "maxOdds",
    header: "Max Odds",
    cell: () => (
      <form className="cursor-pointer flex items-center gap-4 w-full">
        <Input
          name="run"
          type="number"
          id="run"
          placeholder={"Max Odds"}
          className="min-w-[80px]"
        />{" "}
      </form>
    ),
  },
  {
    accessorKey: "betDelay",
    header: "Bet Delay",
    cell: () => (
      <form className="cursor-pointer flex items-center gap-4 w-full">
        <Input
          name="run"
          type="number"
          id="run"
          placeholder={"Bet Delay"}
          className="min-w-[80px]"
        />{" "}
      </form>
    ),
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
