import { agentListColumn, PageHeading } from "@/components";
import { universalGET } from "@/lib/requests";
import { buttonVariants, DataTable } from "@repo/ui";
import Link from "next/link";

async function getAgentList() {
  try {
    const res = await universalGET("/admin/agent/list");

    if (res.data) {
      return res.data;
    }

    return [];
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const list = await getAgentList();

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

      <DataTable columns={agentListColumn} data={list} />
    </div>
  );
}
