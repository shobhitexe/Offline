import { PageHeading, SelectComponent } from "@/components";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Fancy Result</PageHeading>

      <SelectComponent data={[]} link={"/events/add-event?game="} />

      {children}
    </div>
  );
}
