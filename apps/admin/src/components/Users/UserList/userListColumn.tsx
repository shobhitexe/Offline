"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import DepositCredit from "../UserActions/DepositCredit/DepositCredit";
import WithdrawCredit from "../UserActions/WithdrawCredit/WithDrawCredit";
import ProfileInfo from "../UserActions/ProfileInfo/ProfileInfo";
import Permission from "../UserActions/Permissions/Permissions";
import Link from "next/link";

export const userListColumn: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "username",
    header: "UserName [FullName]",
    cell: ({ row }) => (
      <div>
        {row.getValue("username")} [{row.getValue("name")}]
      </div>
    ),
  },
  {
    accessorKey: "Credit Ref.",
    header: "Credit Ref.",
  },
  {
    accessorKey: "P/L",
    header: "P/L",
  },
  {
    accessorKey: "Settlement(P|L)",
    header: "Settlement(P|L)",
  },
  {
    accessorKey: "exposure",
    header: "Exposure",
  },
  {
    accessorKey: "balance",
    header: "Availabel Bal.",
  },
  {
    accessorKey: "createdAt",
    header: "Joining Date",
  },
  {
    accessorKey: "id",
    header: "Action",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/user-list/edit/${row.getValue("id")}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex flex-col items-start">
              <DropdownMenuItem asChild>
                <DepositCredit id={row.getValue("id")} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <WithdrawCredit id={row.getValue("id")} />
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            <div className="flex flex-col items-start">
              <DropdownMenuItem>Reports</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Permission id={row.getValue("id")} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ProfileInfo id={row.getValue("id")} />
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
