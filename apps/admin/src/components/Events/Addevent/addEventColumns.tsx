"use client";

import { ColumnDef } from "@tanstack/react-table";

export const addEventColumn: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index}</div>,
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
  },
];
