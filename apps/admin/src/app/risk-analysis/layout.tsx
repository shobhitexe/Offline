import { PageHeading } from "@/components";

import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Risk Analysis</PageHeading>

      {children}
    </div>
  );
}
