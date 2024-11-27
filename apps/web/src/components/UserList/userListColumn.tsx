"use client";

import { ColumnDef } from "@tanstack/react-table";

export const userListColumn: ColumnDef<any>[] = [
  {
    accessorKey: "#",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "UserName",
    header: "UserName [FullName]",
  },
  {
    accessorKey: "Credit Ref.",
    header: "Credit Ref.",
  },
  {
    accessorKey: "P/L",
    header: "P/L",
  },
  {
    accessorKey: "Settlement(P|L)",
    header: "Settlement(P|L)",
  },
  {
    accessorKey: "Exposure",
    header: "Exposure",
  },
  {
    accessorKey: "Availabel Bal.",
    header: "Availabel Bal.",
  },
  {
    accessorKey: "Joining Date",
    header: "Joining Date",
  },
  {
    accessorKey: "Action",
    header: "Action",
  },
];
