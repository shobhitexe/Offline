import { PageHeading, SelectComponent } from "@/components";
import { universalGET } from "@/lib/requests";
import { EventType } from "@/types";

import { ReactNode } from "react";

type Matches = {
  title: string;
  value: string;
};

async function activeMatches() {
  try {
    const res = await universalGET(`/admin/sports/groupactivebets?id=4`);

    if (!res.data) {
      return [];
    }

    const { data }: { data: EventType[] } = res;

    const matches: Matches[] = [];

    data.map((item) =>
      matches.push({ title: item.eventName, value: item.eventId })
    );

    return matches;
  } catch (error) {
    return [];
  }
}

export default async function layout({ children }: { children: ReactNode }) {
  const activeEvents = await activeMatches();

  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Fancy Result</PageHeading>

      <SelectComponent
        data={activeEvents}
        link={"/match-settings/session?eventId="}
        param="eventId"
      />

      {children}
    </div>
  );
}
