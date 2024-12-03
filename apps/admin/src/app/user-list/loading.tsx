import { PageHeading, userListColumn } from "@/components";
import { buttonVariants, LoadingDataTable } from "@repo/ui";
import Link from "next/link";

export default function loading() {
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

      <LoadingDataTable columns={userListColumn} />
    </div>
  );
}
