import { agentListColumn, PageHeading } from "@/components";
import { universalGET } from "@/lib/requests";
import { buttonVariants, DataTable } from "@repo/ui";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { options } from "../api/auth/[...nextauth]/options";

async function getAgentList(id: string, childLevel: number) {
  try {
    const res = await universalGET(
      `/admin/agent/list?id=${id}&childLevel=${childLevel}`
    );

    if (res.data) {
      return res.data;
    }

    return [];
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const session = await getServerSession(options);

  const list = await getAgentList(session?.user.id!, session?.user.childLevel!);

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
