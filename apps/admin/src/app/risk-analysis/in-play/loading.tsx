import { RiskAnalysis } from "@/components";
import Tabs from "../Tabs";
import { Skeleton } from "@repo/ui";

export default function loading() {
  return (
    <div className="w-full flex flex-col">
      <Tabs />

      <RiskAnalysis events={[]} heading="Cricket" />
      <Skeleton className="w-full h-10" />
      <RiskAnalysis events={[]} heading="Tennis" />
      <Skeleton className="w-full h-10" />
      <RiskAnalysis events={[]} heading="Football" />
      <Skeleton className="w-full h-10" />
    </div>
  );
}
