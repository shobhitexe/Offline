"use client";

import { BetTableDataType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";

export const BetStatementColumns: ColumnDef<BetTableDataType>[] = [
  {
    accessorKey: "matchName",
    header: "SR No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "oddsPrice",
    header: "Description",
    cell: ({ row }) => {
      const matchName = row.getValue("matchName") as string;
      const marketType = row.getValue("marketType") as string;
      const runnerName = row.getValue("runnerName") as string;

      return (
        <div className="flex flex-wrap gap-2 font-medium">
          <div className="bg-black text-white rounded-sm p-1">{matchName}</div>{" "}
          <div className="bg-black text-white rounded-sm p-1">{marketType}</div>
          <div className="bg-black text-white rounded-sm p-1">{runnerName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "marketType",
    header: "",
    cell: () => <></>,
  },
  {
    accessorKey: "runnerName",
    header: "",
    cell: () => <></>,
  },
  {
    accessorKey: "oddsRate",
    header: "Odds",
    cell: ({ row }) => {
      const rate = row.getValue("oddsRate") as string;
      const price = row.getValue("oddsPrice") as string;
      return (
        <div>
          {rate}/{price}
        </div>
      );
    },
  },
  {
    accessorKey: "credit",
    header: "Profit",
  },
  {
    accessorKey: "debit",
    header: "Stake",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
