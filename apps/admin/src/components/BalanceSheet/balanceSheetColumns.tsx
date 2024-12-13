"use client";

import { ColumnDef } from "@tanstack/react-table";
import Settlement from "../Users/UserActions/Settlement";
import Link from "next/link";

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
      const id = row.getValue("id") as string;

      var userDiv;

      switch (userType) {
        case "user":
          userDiv = <div className="bg-yellow-500 p-1 rounded">C</div>;
          break;
        case "agent":
          userDiv = (
            <Link
              href={`/balance-sheet/agent/${id}`}
              className="bg-red-500 p-1 rounded"
            >
              A
            </Link>
          );
          break;
        case "cash":
          userDiv = <div className="bg-green-500 p-1 rounded">Cash</div>;
          break;
        case "session":
          userDiv = (
            <div className="bg-yellow-500 p-1 rounded">Session Commission</div>
          );
          break;
        case "settlement":
          userDiv = (
            <div className="bg-yellow-500 p-1 rounded">Settlement (Parent)</div>
          );
          break;
        case "cashparent":
          userDiv = <div className="bg-green-500 p-1 rounded">Cash Parent</div>;
          break;
        case "pnl":
          userDiv = (
            <div className="bg-violet-500 text-white p-1 rounded">
              Market P/L
            </div>
          );
          break;
        case "commission":
          userDiv = (
            <div className="bg-blue-500 text-white p-1 rounded">
              Market Commission
            </div>
          );
          break;
        default:
          userDiv = <></>;
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
          className={`${value > 0 ? "text-green-500" : "text-red-500"} font-medium`}
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
      const balance = row.getValue("balance") as number;
      const id = row.getValue("id") as string;
      const username = row.getValue("username") as string;

      if (userType === "user" || userType === "agent") {
        return (
          <Settlement
            settlement={balance}
            id={id}
            name={username}
            table="balancesheet"
            userType={userType}
          />
        );
      }
    },
  },
];
