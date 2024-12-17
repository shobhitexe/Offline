import { PageHeading, sessionHistoryColumns } from "@/components";
import { universalGET } from "@/lib/requests";
import { DataTable } from "@repo/ui";

async function getData() {
  try {
    const res = await universalGET(`/admin/sports/runner/history`);

    if (!res.data) {
      return [];
    }

    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const data = await getData();

  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Session History</PageHeading>

      <DataTable columns={sessionHistoryColumns} data={data} />
    </div>
  );
}
