"use client";

import { Button } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import Settlement from "../Users/UserActions/Settlement";

export const balanceSheetColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "username",
    header: "UserName [FullName]",
    cell: ({ row }) => {
      const userType = row.getValue("userType") as string;

      var userDiv;

      switch (userType) {
        case "user":
          userDiv = <div className="bg-yellow-500 p-1 rounded">C</div>;
          break;
        case "agent":
          userDiv = <div className="bg-red-500 p-1 rounded">A</div>;
          break;
        case "cash":
          userDiv = <div className="bg-green-500 p-1 rounded">Cash</div>;
      }

      return (
        <div className="flex items-center gap-2">
          <span className={`cursor-pointer`}>{userDiv}</span>
          {row.getValue("username")}
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
      const userType = row.getValue("userType") as string;

      if (userType === "cash") {
        return <></>;
      }

      const balance = row.getValue("balance") as number;
      const id = row.getValue("balance") as string;
      const username = row.getValue("username") as string;

      return (
        <Settlement
          settlement={balance}
          id={id}
          name={username}
          table="balancesheet"
        />
      );
    },
  },
];
