"use client";

import { Switch } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { changeOpenMarketStatus } from "./changeOpenMarketAction";

export const openMarketColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "eventName",
    header: "Match Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "eventId",
    header: "Match Id",
  },
  {
    accessorKey: "eventTime",
    header: "Match Time",
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("active");

      return <div>{status === true ? "Active" : "Disabled"}</div>;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const status = row.getValue("active") as boolean;
      const eventId = row.getValue("eventId") as string;

      return (
        <Switch
          defaultChecked={status}
          onCheckedChange={() => changeOpenMarketStatus(eventId)}
        />
      );
    },
  },
];
