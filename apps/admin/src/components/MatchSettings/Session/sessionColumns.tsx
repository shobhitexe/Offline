"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Save } from "lucide-react";

export const sessionColumns: ColumnDef<any>[] = [
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
    accessorKey: "sessionName",
    header: "Session Name",
  },
  {
    accessorKey: "run",
    header: "Run",
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
