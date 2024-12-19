import { RiskAnalysis } from "@/components";
import { universalGET } from "@/lib/requests";
import { EventType } from "@/types";
import Tabs from "../Tabs";

async function getData() {
  try {
    const res = await universalGET("/sports/all");

    if (!res.data) {
      return [];
    }

    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const data: {
    cricket: EventType[];
    tennis: EventType[];
    football: EventType[];
  } = await getData();

  return (
    <div className="w-full flex flex-col gap-5">
      <Tabs />

      <RiskAnalysis events={data.cricket || []} heading="Cricket" />
      <RiskAnalysis events={data.tennis || []} heading="Tennis" />
      <RiskAnalysis events={data.football || []} heading="Football" />
    </div>
  );
}
