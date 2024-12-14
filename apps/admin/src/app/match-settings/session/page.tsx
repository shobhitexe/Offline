import { sessionColumns } from "@/components";
import { universalGET } from "@/lib/requests";
import { DataTable } from "@repo/ui";

async function getRunners(eventId: string) {
  try {
    const res = await universalGET(
      `/admin/sports/event/runners?eventId=${eventId}`
    );

    if (!res.data) {
      return [];
    }

    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const eventId = searchParams["eventId"] as string;

  if (eventId === undefined) {
    return <DataTable columns={sessionColumns} data={[]} />;
  }

  const data = await getRunners(eventId);

  console.log(data);

  return <DataTable columns={sessionColumns} data={data} />;
}
