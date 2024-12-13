import { addEventColumn } from "@/components";
import { universalGET } from "@/lib/requests";
import { DataTable } from "@repo/ui";

async function getData(game: number) {
  try {
    const res = await universalGET(`/admin/sports/events/getlist?game=${game}`);

    if (!res.data) {
      return [];
    }

    return res.data;
  } catch (error) {
    return [];
  }
}

const gamemap: Record<string, number> = { cricket: 4, soccer: 1, tennis: 2 };

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const game = searchParams["game"] as string;

  const data = await getData(gamemap[game]);

  return <DataTable columns={addEventColumn} data={data} />;
}
