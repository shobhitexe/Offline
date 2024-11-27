import { PageHeading, userListColumn } from "@/components";
import { DataTable } from "@repo/ui";

export default function page() {
  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>User List</PageHeading>

      <DataTable columns={userListColumn} data={[]} />
    </div>
  );
}
