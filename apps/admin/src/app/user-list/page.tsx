import { PageHeading, userListColumn } from "@/components";
import { universalGET } from "@/lib/requests";
import { buttonVariants, DataTable } from "@repo/ui";
import Link from "next/link";

async function getUserList() {
  try {
    const res = await universalGET("/admin/user/list");

    if (res.data) {
      return res.data;
    }

    return [];
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const list = await getUserList();

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
