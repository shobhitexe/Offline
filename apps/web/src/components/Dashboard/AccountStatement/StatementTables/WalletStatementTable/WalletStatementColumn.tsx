"use client";

import { WalletDataType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";

export const WalletStatementColumns: ColumnDef<WalletDataType>[] = [
  {
    accessorKey: "srNo",
    header: "SR No.",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "date",
    header: "Date & Remark",
  },
];
