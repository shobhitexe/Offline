import { balanceSheetColumns, PageHeading } from "@/components";
import { DataTable } from "@repo/ui";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
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

export default async function page() {
  const session = await getServerSession(options);

  const data = await getData(session?.user.id!);

  return (
    <div className="w-full flex flex-col gap-5">
      <PageHeading>Balance Sheet</PageHeading>

      <div className="flex sm:flex-row flex-col w-full gap-2">
        <DataTable columns={balanceSheetColumns} data={data.profit} />
        <DataTable columns={balanceSheetColumns} data={data.loss} />
      </div>
    </div>
  );
}
