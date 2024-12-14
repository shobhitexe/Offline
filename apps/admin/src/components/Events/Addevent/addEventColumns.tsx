"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Save } from "lucide-react";

export const addEventColumn: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Competition",
  },
  {
    accessorKey: "competitionRegion",
    header: "Competition Region",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        <Save />
      </div>
    ),
  },
];
