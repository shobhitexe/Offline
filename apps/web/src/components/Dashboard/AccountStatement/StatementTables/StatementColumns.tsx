"use client";

import { BetTableDataType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";

export const StatementColumns: ColumnDef<BetTableDataType>[] = [
  {
    accessorKey: "matchName",
    header: "SR No.",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "transactionType",
    header: "Description",
    cell: ({ row }) => {
      const type = row.getValue("transactionType") as string;

      const matchName = row.getValue("matchName") as string;
      const marketType = row.getValue("marketType") as string;
      const runnerName = row.getValue("runnerName") as string;

      if (type === "Deposit" || type === "Withdraw") {
        return (
          <div className="bg-black text-white rounded-sm p-1 w-fit font-medium">
            {type}
          </div>
        );
      }

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
    accessorKey: "credit",
    header: "Credit",
  },
  {
    accessorKey: "debit",
    header: "Debit",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
