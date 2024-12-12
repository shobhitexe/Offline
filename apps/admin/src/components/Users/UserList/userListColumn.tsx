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
import { MoreHorizontal, PencilIcon } from "lucide-react";

import DepositCredit from "../UserActions/DepositCredit/DepositCredit";
import WithdrawCredit from "../UserActions/WithdrawCredit/WithDrawCredit";
import ProfileInfo from "../UserActions/ProfileInfo/ProfileInfo";
import Permission from "../UserActions/Permissions/Permissions";
import Link from "next/link";
import Settlement from "../UserActions/Settlement";
import DepositCreditAdmin from "@/components/Agents/AgentsActions/DepositCredit/DepositCreditAdmin";
import WithdrawCreditAdmin from "@/components/Agents/AgentsActions/WithdrawCredit/WithDrawCreditAdmin";
import PermissionAdmin from "@/components/Agents/AgentsActions/Permissions/PermissionsAdmin";
import ProfileInfoAdmin from "@/components/Agents/AgentsActions/ProfileInfo/ProfileInfoAdmin";

export const userListColumn: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => <div>{row.index !== 0 && row.index}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      return (
        <div
          className={`${role === "A" ? "bg-red-500" : "bg-yellow-500"} w-fit p-1 rounded`}
        >
          {role}
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "UserName [FullName]",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div>
          {row.getValue("username")} {name && `[${name}]`}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Credit Ref.",
  },
  {
    accessorKey: "pnl",
    header: "P/L",
  },
  {
    accessorKey: "settlement",
    header: "Settlement(P|L)",
    cell: ({ row }) => {
      const settlement = row.getValue("settlement") as number;
      const id = row.getValue("id") as string;
      const name = row.getValue("name") as string;

      return (
        <>
          {row.index !== 0 ? (
            <div className="flex items-center gap-2 w-full">
              <Settlement settlement={settlement} id={id} name={name} />
              <div className="bg-blue-400 w-fit p-1 text-white cursor-pointer rounded">
                H
              </div>
            </div>
          ) : (
            <div
              className={`${settlement < 0 ? "text-red-500" : "text-green-500"}`}
            >
              {settlement}
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "exposure",
    header: "Exposure",
    cell: ({ row }) => {
      const exposure = (row.getValue("exposure") as number) || 0;

      return (
        <div className="text-red-500">
          {exposure > 0 && "-"}
          {exposure}
        </div>
      );
    },
  },
  {
    accessorKey: "availBal",
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
      if (!row.getValue("username")) {
        return null;
      }

      const role = row.getValue("role") as string;

      return (
        <div className="flex items-center">
          {role === "C" ? (
            <div className="flex items-center gap-1">
              <DepositCredit id={row.getValue("id")} />
              <WithdrawCredit id={row.getValue("id")} />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <DepositCreditAdmin id={row.getValue("id")} />
              <WithdrawCreditAdmin id={row.getValue("id")} />
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <div className="flex flex-col items-start">
                <DropdownMenuItem>Reports</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {role === "C" ? (
                    <Permission id={row.getValue("id")} />
                  ) : (
                    <PermissionAdmin id={row.getValue("id")} />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {role === "C" ? (
                    <ProfileInfo id={row.getValue("id")} />
                  ) : (
                    <ProfileInfoAdmin id={row.getValue("id")} />
                  )}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {role === "C" ? (
            <Link href={`/list/edit/${row.getValue("id")}`}>
              <PencilIcon className="w-4 h-4" />
            </Link>
          ) : (
            <Link href={`/agent/edit/${row.getValue("id")}`}>
              <PencilIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      );
    },
  },
];
