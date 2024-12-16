"use client";

import { universalPOST } from "@/lib/requests";
import { LoadingSpinner, useToast } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Save } from "lucide-react";
import { useState } from "react";
import { ro } from "react-day-picker/locale";

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
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const { toast } = useToast();

      const [loading, setIsLoading] = useState(false);

      const sportsid = row.getValue("sportsId") as string;
      const competitionid = row.getValue("id") as string;
      const name = row.getValue("name") as string;

      async function saveEvents() {
        try {
          setIsLoading(true);

          const res = await universalPOST(
            `/admin/sports/saveActiveEvents?sportsid=${sportsid}&competitionid=${competitionid}`,
            { sportsid, competitionid: competitionid, competitionName: name }
          );

          if (res.data !== true) {
            if (
              res.includes("duplicate key value violates unique constraint")
            ) {
              toast({
                title: "Failed",
                description: "Already Enabled",
                variant: "destructive",
              });
            } else {
              toast({ description: "Failed", variant: "destructive" });
            }
            return;
          }

          toast({ description: "Enabled" });
        } catch (error) {
          toast({ description: "Failed", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      }

      return (
        <div className="cursor-pointer" onClick={() => saveEvents()}>
          {loading ? <LoadingSpinner /> : <Save />}
        </div>
      );
    },
  },
];
