"use client";

import { BetTableDataType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";

export const BetStatementColumns: ColumnDef<BetTableDataType>[] = [
  {
    accessorKey: "srNo",
    header: "SR No.",
  },
  {
    accessorKey: "result",
    header: "Type",
  },
  {
    accessorKey: "walletType",
    header: "Wallet Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "date",
    header: "Date & Remark",
  },
  {
    accessorKey: "roundId",
    header: "Round ID",
  },
  {
    accessorKey: "gameDetails",
    header: "Game details",
    cell: ({ row }) => (
      <div className="capitalize">
        {row
          .getValue("gameDetails")
          ?.toString()
          .split("\n")
          .map((item, idx) => (
            <span key={item}>
              {item}

              <br />
            </span>
          ))}
      </div>
    ),
  },
];
