import { PageHeading } from "@/components";

import { ReactNode } from "react";
import Tabs from "./Tabs";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Risk Analysis</PageHeading>
      <Tabs />
      {children}
    </div>
  );
}
