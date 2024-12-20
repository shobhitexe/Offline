import { Fancy } from "@repo/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { ArrowRight, ChartArea } from "lucide-react";

export default function FancyBetsDialog({ fancyData }: { fancyData: Fancy }) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-2">
          <ArrowRight className="w-3 h-3 -top-px relative" />{" "}
          {`${fancyData.TotalExposure}`}{" "}
          <ChartArea className="w-4 h-4 text-white -top-px relative" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="text-center text-black">{fancyData.RunnerName}</div>
            <table>
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                {Object.entries(fancyData.Projections).map(
                  ([oddsRate, projection], idx) => {
                    return (
                      <tr key={oddsRate} className="border">
                        <td className="border border-black p-1 text-black">
                          {oddsRate}
                        </td>
                        <td
                          className={`border border-black p-1 ${
                            projection < 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {projection}
                        </td>
                      </tr>
                    );
                  }
                )}
                {/* {Array.from({ length: 11 }, (_, i) => {
                  const offset = i - 5;
                  const oddsRate = fancyData.OddsRate + offset;

                  const isNegative =
                    (fancyData.TotalExposure < 0 && i >= 5) ||
                    (fancyData.TotalExposure >= 0 && i < 5);

                  return (
                    <tr key={oddsRate} className="border">
                      <td className="border border-black p-1 text-black">
                        {oddsRate}
                      </td>
                      <td
                        className={`border border-black p-1 ${
                          isNegative ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isNegative
                          ? -fancyData.TotalExposure
                          : fancyData.TotalProfit}
                      </td>
                    </tr>
                  );
                })} */}
              </tbody>
            </table>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
