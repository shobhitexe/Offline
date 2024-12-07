"use client";

import { RequestWithdrawalType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";

export const ReferraltableColumns: ColumnDef<RequestWithdrawalType>[] = [
  {
    accessorKey: "srNo",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "user",
    header: "user",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Earned Reward",
  },
];
