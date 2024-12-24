"use client";

import { DataTable, Input, LoadingSpinner, useToast } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Save } from "lucide-react";
import { useState } from "react";
import { SportsSettings } from "@repo/types";
import { universalPOST } from "@/lib/requests";

export default function SportsSettingsTable({
  settingsdata,
}: {
  settingsdata: SportsSettings[];
}) {
  const [data, setData] = useState(settingsdata);

  const updateCellValue = (rowIndex: number, key: string, value: any) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [key]: value };
      return newData;
    });
  };

  const sportsSettingsColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "#",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: "Sport Name",
    },
    {
      accessorKey: "maxStake",
      header: "Max Stake",
      cell: ({ row }) => (
        <Input
          type="number"
          defaultValue={data[row.index]["maxStake"]}
          onBlur={(e) => updateCellValue(row.index, "maxStake", e.target.value)}
          className="min-w-[80px] border border-gray-300 rounded p-2"
        />
      ),
    },
    {
      accessorKey: "minStake",
      header: "Min Stake",
      cell: ({ row }) => (
        <Input
          type="number"
          defaultValue={data[row.index]["minStake"]}
          onBlur={(e) => updateCellValue(row.index, "minStake", e.target.value)}
          className="min-w-[80px] border border-gray-300 rounded p-2"
        />
      ),
    },
    {
      accessorKey: "beforeInPlayMaxStake",
      header: "Before In Play Max Stake",
      cell: ({ row }) => (
        <Input
          type="number"
          defaultValue={data[row.index]["beforeInPlayMaxStake"]}
          onBlur={(e) =>
            updateCellValue(row.index, "beforeInPlayMaxStake", e.target.value)
          }
          className="min-w-[80px] border border-gray-300 rounded p-2"
        />
      ),
    },
    {
      accessorKey: "beforeInPlayMinStake",
      header: "Before In Play Min Stake",
      cell: ({ row }) => (
        <Input
          type="number"
          defaultValue={data[row.index]["beforeInPlayMinStake"]}
          onBlur={(e) =>
            updateCellValue(row.index, "beforeInPlayMinStake", e.target.value)
          }
          className="min-w-[80px] border border-gray-300 rounded p-2"
        />
      ),
    },
    {
      accessorKey: "maxOdds",
      header: "Max Odds",
      cell: ({ row }) => (
        <Input
          type="number"
          defaultValue={data[row.index]["maxOdds"]}
          onBlur={(e) => updateCellValue(row.index, "maxOdds", e.target.value)}
          className="min-w-[80px] border border-gray-300 rounded p-2"
        />
      ),
    },
    {
      accessorKey: "betDelay",
      header: "Bet Delay",
      cell: ({ row }) => (
        <Input
          type="number"
          defaultValue={data[row.index]["betDelay"]}
          onBlur={(e) => updateCellValue(row.index, "betDelay", e.target.value)}
          className="min-w-[80px] border border-gray-300 rounded p-2"
        />
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const { toast } = useToast();
        const [loading, setIsLoading] = useState(false);

        const settings = data[row.index];

        async function updateSportsSettings() {
          try {
            setIsLoading(true);
            const res = await universalPOST("/admin/settings/sports", {
              id: Number(settings.id),
              name: settings.name,
              maxStake: Number(settings.maxStake),
              minStake: Number(settings.minStake),
              beforeInPlayMaxStake: Number(settings.beforeInPlayMaxStake),
              beforeInPlayMinStake: Number(settings.beforeInPlayMinStake),
              maxOdds: Number(settings.maxOdds),
              betDelay: Number(settings.betDelay),
            });

            if (res.data !== true) {
              toast({
                description: "Failed to update settings",
                variant: "destructive",
              });
              return;
            }

            toast({
              description: "Settings updated",
            });
          } catch (error) {
            toast({
              description: "Failed to update settings",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        }

        return (
          <div className="cursor-pointer" onClick={updateSportsSettings}>
            {loading ? <LoadingSpinner /> : <CircleCheck />}
          </div>
        );
      },
    },
  ];

  return <DataTable columns={sportsSettingsColumns} data={data} />;
}
