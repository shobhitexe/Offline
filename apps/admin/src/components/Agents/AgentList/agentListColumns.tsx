"use client";

import { ColumnDef } from "@tanstack/react-table";

export const agentListColumn: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "username",
    header: "UserName [FullName]",
    cell: ({ row }) => (
      <div>
        {row.getValue("username")} [{row.getValue("name")}]
      </div>
    ),
  },
  {
    accessorKey: "balance",
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
    accessorKey: "balance",
    header: "Availabel Bal.",
  },
  {
    accessorKey: "createdAt",
    header: "Joining Date",
  },
  {
    accessorKey: "id",
    header: "Action",
  },
];
