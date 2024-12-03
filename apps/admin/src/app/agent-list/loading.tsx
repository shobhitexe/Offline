import { agentListColumn, PageHeading } from "@/components";
import { buttonVariants, LoadingDataTable } from "@repo/ui";
import Link from "next/link";
import React from "react";

export default function loading() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading
        button={
          <Link
            href={"/add/agent"}
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <div className="mt-px">Add Agent</div>
          </Link>
        }
      >
        Agent List
      </PageHeading>

      <LoadingDataTable columns={agentListColumn} />
    </div>
  );
}
