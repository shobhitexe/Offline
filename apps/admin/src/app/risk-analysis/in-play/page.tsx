import { RiskAnalysis } from "@/components";
import { universalGET } from "@/lib/requests";
import { EventType } from "@/types";
import Tabs from "../Tabs";

async function getData() {
  try {
    const res = await universalGET("/sports/getActiveEvents?id=4");

    if (!res.data) {
      return [];
    }

    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const data: EventType[] = await getData();

  return (
    <div className="w-full flex flex-col gap-5">
      <Tabs />

      <RiskAnalysis events={data} />
    </div>
  );
}
