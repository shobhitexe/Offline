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
    accessorKey: "Exposure",
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
    id: "actions",
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Deposit Credit</DropdownMenuItem>
            <DropdownMenuItem>Withdraw Credit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Permission</DropdownMenuItem>
            <DropdownMenuItem>Level - Supermaster</DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
