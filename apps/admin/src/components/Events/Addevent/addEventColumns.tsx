"use client";

import { universalPOST } from "@/lib/requests";
import { LoadingSpinner, Switch, useToast } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCcw, Save } from "lucide-react";
import { useState } from "react";

export const addEventColumn: ColumnDef<any>[] = [
  {
    accessorKey: "sportsId",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Competition",
  },
  {
    accessorKey: "competitionRegion",
    header: "Competition Region",
  },
  {
    accessorKey: "status",
    header: "Action",
    cell: ({ row }) => {
      const { toast } = useToast();

      const [loading, setIsLoading] = useState(false);

      const sportsid = row.getValue("sportsId") as string;
      const competitionid = row.getValue("id") as string;
      const name = row.getValue("name") as string;
      const status = row.getValue("status") as boolean;

      async function changeStatus() {
        console.log(!status);

        try {
          setIsLoading(true);

          const res = await universalPOST(`/admin/sports/tournament/status`, {
            sportsid,
            competitionid: competitionid,
            competitionName: name,
            Status: !status,
          });

          if (res.data !== true) {
            toast({ description: "Failed", variant: "destructive" });

            return;
          }

          toast({ description: "Tournament List updated" });
        } catch (error) {
          toast({ description: "Failed", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      }

      return (
        <Switch
          defaultChecked={status}
          onCheckedChange={() => changeStatus()}
        />
        // <div className="cursor-pointer" onClick={() => saveEvents()}>
        //   {loading ? <LoadingSpinner /> : <RefreshCcw />}
        // </div>
      );
    },
  },
];
