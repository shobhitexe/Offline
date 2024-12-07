import { DashboardHeading, Statement, StatementTables } from "@/components";
import React from "react";

export default function AccountStatement() {
  return (
    <div className="w-[95%] mx-auto">
      <DashboardHeading heading={"Account Statement"} />

      <div className="flex flex-col gap-5 sm:py-10 py-5 sm:px-5 px-3 rounded-xl mt-5 bg-cardBG">
        <Statement />
        <StatementTables />
      </div>
    </div>
  );
}
