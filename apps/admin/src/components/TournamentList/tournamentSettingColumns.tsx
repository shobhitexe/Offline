"use client";

import { DataTable } from "@repo/ui";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck } from "lucide-react";
import { TournamentSettings } from "@repo/types";
import Link from "next/link";

export default function TournamentSettingsComponent({
  data,
}: {
  data: TournamentSettings[];
}) {
  const tournamentSettingsColumns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "tournamentName",
      header: "Tournament Name",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        const tournamentName = row.getValue("tournamentName") as string;

        return (
          <Link
            href={`/tournament-list/edit/${id}`}
            className="cursor-pointer hover:underline"
          >
            {tournamentName}
          </Link>
        );
      },
    },

    {
      accessorKey: "",
      header: "Stakes Table",
      cell: ({ row }) => {
        return (
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Category</th>
                <th className="border border-gray-400 px-4 py-2">Type</th>
                <th className="border border-gray-400 px-4 py-2">Min</th>
                <th className="border border-gray-400 px-4 py-2">Max</th>
              </tr>
            </thead>
            <tbody>
              {/* Match Odds Stakes */}
              <tr>
                <td className="border border-gray-400 px-4 py-2" rowSpan={2}>
                  Match Odds Stakes
                </td>
                <td className="border border-gray-400 px-4 py-2">Pre</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].preMOStakesMin}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].preMOStakesMax}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Post</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].postMOStakesMin}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].postMOStakesMax}
                </td>
              </tr>

              {/* Bookmaker Stakes */}
              <tr>
                <td className="border border-gray-400 px-4 py-2" rowSpan={2}>
                  Bookmaker Stakes
                </td>
                <td className="border border-gray-400 px-4 py-2">Pre</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].preBMStakesMin}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].preBMStakesMax}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Post</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].postBMStakesMin}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].postBMStakesMax}
                </td>
              </tr>

              {/* Fancy Stakes */}
              <tr>
                <td className="border border-gray-400 px-4 py-2" rowSpan={2}>
                  Fancy Stakes
                </td>
                <td className="border border-gray-400 px-4 py-2">Pre</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].preFancyStakesMin}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].preFancyStakesMax}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Post</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].postFancyStakesMin}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].postFancyStakesMax}
                </td>
              </tr>
            </tbody>
          </table>
        );
      },
    },
    {
      accessorKey: "",
      header: "Toss Stakes",
      cell: ({ row }) => {
        return (
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2"></th>
                <th className="border border-gray-400 px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Min</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].tossStakesMin}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Max</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].tossStakesMax}
                </td>
              </tr>
            </tbody>
          </table>
        );
      },
    },
    {
      accessorKey: "",
      header: "Bet Delay",
      cell: ({ row }) => {
        return (
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2"></th>
                <th className="border border-gray-400 px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Match Odds</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].betDelayMO}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">BookMaker</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].betDelayBM}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Fancy</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].betDelayFA}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Toss</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].betDelayTO}
                </td>
              </tr>
            </tbody>
          </table>
        );
      },
    },
    {
      accessorKey: "",
      header: "Max Profit",
      cell: ({ row }) => {
        return (
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2"></th>
                <th className="border border-gray-400 px-4 py-2">Max Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Match Odds</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].maxProfitMO}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">BookMaker</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].maxProfitBM}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Fancy</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].maxProfitFA}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-2">Toss</td>
                <td className="border border-gray-400 px-4 py-2">
                  {data[row.index].maxProfitTO}
                </td>
              </tr>
            </tbody>
          </table>
        );
      },
    },
    {
      accessorKey: "",
      header: "Max Odds",
      cell: ({ row }) => {
        return <div>{data[row.index].maxOdds}</div>;
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;

        return (
          <Link href={`/tournament-list/edit/${id}`} className="cursor-pointer">
            <CircleCheck />
          </Link>
        );
      },
    },
  ];

  return <DataTable columns={tournamentSettingsColumns} data={data} />;
}
