"use client";

import { Button } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";

export const balanceSheetColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "username",
    header: "UserName [FullName]",
    cell: ({ row }) => {
      const userType = row.getValue("userType") as string;
      const name = row.getValue("name") as string;

      return (
        <div className="flex items-center gap-2">
          <span
            className={`${userType === "user" ? "bg-yellow-500" : "bg-red-500"} p-1 cursor-pointer`}
          >
            {userType !== "" && userType[0].toUpperCase()}
          </span>
          {row.getValue("username")} {name && `[${name}]`}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const value = row.getValue("balance") as number;

      return (
        <div
          className={`${value >= 0 ? "text-green-500" : "text-red-500"} font-medium`}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "userType",
    header: "Action",
    cell: ({ row }) => {
      const userType = row.getValue("userType");

      return (
        <div>
          {userType === "user" ? (
            <div className="flex items-center gap-2">
              <Button>Settlement</Button>
              <Button>History</Button>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    },
  },
];
