"use client";

import { Input } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Save } from "lucide-react";

export const tournamentSettingsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: "Tournament Name",
  },
  {
    accessorKey: "premoStakes",
    header: "Pre MO stakes",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "postmoStakes",
    header: "Post MO stakes",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "preBMStakes",
    header: "Pre BM stakes",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "postBMStakes",
    header: "Post BM stakes",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "preFancyStakes",
    header: "Pre Fancy stakes",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "postFancyStakes",
    header: "Post Fancy stakes",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "tossStake",
    header: "Toss stakes",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "betDelay",
    header: "Bet Delay",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "maxProfit",
    header: "Max Profit",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
      </form>
    ),
  },
  {
    accessorKey: "maxOdds",
    header: "Max Odds",
    cell: ({ row }) => (
      <form className="cursor-pointer flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          Min:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
        <div className="flex items-center gap-2">
          Max:{" "}
          <Input name="run" type="number" id="run" className="min-w-[80px]" />{" "}
        </div>
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
