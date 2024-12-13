import { PageHeading, userListColumn } from "@/components";
import { universalGET } from "@/lib/requests";
import { DataTable } from "@repo/ui";

async function getUserList(id: string) {
  try {
    const res = await universalGET(`/admin/list?id=${id}`);

    if (res.data) {
      return res.data;
    }

    return [];
  } catch (error) {
    return [];
  }
}

export default async function page({ params }: { params: { id: string } }) {
  const list = await getUserList(params.id);

  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>List</PageHeading>

      <DataTable columns={userListColumn} data={list} />
    </div>
  );
}
