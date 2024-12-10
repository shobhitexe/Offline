import {
  DataTable,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";

type BetHistoryPerGame = {
  selection: string;
  odds: number;
  stake: number;
  pnl: number;
  betType: string;
};

import { Menu, RefreshCcw } from "lucide-react";

import { KeyedMutator } from "swr";

export default function BetHistory({
  data,
  mutate,
}: {
  data: BetHistoryPerGame[];
  mutate: KeyedMutator<any>;
}) {
  return (
    <Dialog>
      <DialogTrigger className="fixed sm:bottom-5 bottom-16 sm:right-10 right-5 bg-white p-3 rounded-full">
        <div className="relative">
          <Menu className="text-black" />{" "}
          <div className="absolute bg-black -top-4 -right-2 px-2 rounded-full text-sm">
            {data && data.length}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="ui-text-black overflow-x-auto">
        <DialogHeader>
          <DialogTitle className="text-black text-center flex items-center justify-center gap-3">
            My Bets <RefreshCcw className="w-3 h-3" onClick={() => mutate()} />
          </DialogTitle>
          {/* <DataTable columns={betHistoryColumns} data={data?.data || []} /> */}

          <div className="overflow-x-auto max-h-[500px]">
            <table className="min-w-full border-collapse border border-gray-300 text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    Selection
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Odds</th>
                  <th className="border border-gray-300 px-4 py-2">Stake</th>
                  <th className="border border-gray-300 px-4 py-2">PNL</th>
                </tr>
              </thead>
              <tbody>
                {data.map((bet, index) => (
                  <tr
                    key={index}
                    className={`${
                      bet.betType === "back" || bet.betType === "yes"
                        ? "bg-[#72bbef]/40"
                        : "bg-[#faa9ba]/40"
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {bet.selection}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {bet.odds}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {bet.stake}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {bet.pnl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
