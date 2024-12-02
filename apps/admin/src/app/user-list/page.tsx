import { PageHeading, userListColumn } from "@/components";
import { universalGET } from "@/lib/requests";
import { buttonVariants, DataTable } from "@repo/ui";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { options } from "../api/auth/[...nextauth]/options";

async function getUserList(id: string) {
  try {
    const res = await universalGET(`/admin/user/list?id=${id}`);

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

  const list = await getUserList(session?.user.id!);

  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading
        button={
          <Link
            href={"/add/user"}
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <div className="mt-px">Add User</div>
          </Link>
        }
      >
        User List
      </PageHeading>

      <DataTable columns={userListColumn} data={list} />
    </div>
  );
}
