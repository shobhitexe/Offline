"use client";

import { BonusHistoryTableType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";

export const BonusHistoryColumns: ColumnDef<BonusHistoryTableType>[] = [
  {
    accessorKey: "srNo",
    header: "SR No.",
  },
  {
    accessorKey: "type",
    header: "Bonus Type / Id",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "date",
    header: "Claim Date",
  },
];
