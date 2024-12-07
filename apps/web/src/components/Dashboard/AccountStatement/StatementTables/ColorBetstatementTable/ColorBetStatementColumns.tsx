"use client";

import { ColumnDef } from "@tanstack/react-table";

export const ColorBetstatementColumn: ColumnDef<any>[] = [
  {
    accessorKey: "srNo",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "stage",
    header: "Periods",
  },
  {
    accessorKey: "money",
    header: "Amount",
    cell: ({ row }) => (
      <div
        className={`${row.getValue("status") === 1 ? "text-green-500" : "text-red-500"}`}
      >
        {row.getValue("status") === 1 ? "+" : "-"}
        {row.getValue("money")}
      </div>
    ),
  },
  {
    accessorKey: "game",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`${row.getValue("status") === 1 ? "bg-green-500" : "bg-red-500"} w-fit px-3 py-2 rounded-lg`}
      >
        {row.getValue("status") === 1 ? "Win" : "Loss"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Time",
  },
];
