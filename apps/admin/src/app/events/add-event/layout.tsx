import { PageHeading, SelectComponent } from "@/components";
import { ReactNode } from "react";

const Games = [
  { title: "Cricket", value: "cricket" },
  { title: "Soccer", value: "soccer" },
  { title: "Tennis", value: "tennis" },
];

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Add Event</PageHeading>

      <SelectComponent
        data={Games}
        link={"/events/add-event?game="}
        param="game"
      />

      {children}
    </div>
  );
}
