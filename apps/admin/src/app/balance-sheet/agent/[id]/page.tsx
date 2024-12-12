import { balanceSheetColumnsChild, PageHeading } from "@/components";
import { DataTable } from "@repo/ui";
import { universalGET } from "@/lib/requests";

async function getData(id: string) {
  try {
    const res = await universalGET(`/admin/report/balancesheet?id=${id}`);

    if (!res.data) {
      return { profit: [], loss: [] };
    }

    return res.data;
  } catch (error) {
    return { profit: [], loss: [] };
  }
}

export default async function page({ params }: { params: { id: string } }) {
  const data = await getData(params.id);

  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Balance Sheet</PageHeading>

      <div className="flex sm:flex-row flex-col w-full gap-2">
        <DataTable columns={balanceSheetColumnsChild} data={data.loss} />
        <DataTable columns={balanceSheetColumnsChild} data={data.profit} />
      </div>
    </div>
  );
}
