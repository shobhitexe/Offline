import { PageHeading, TournamentEdit } from "@/components";
import { universalGET } from "@/lib/requests";

async function getData(id: string) {
  try {
    const res = await universalGET(`/admin/settings/tournamentdata?id=${id}`);

    if (!res.data) {
      return [];
    }

    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function page({ params }: { params: { id: string } }) {
  const data = await getData(params.id);

  console.log(data);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* <PageHeading>Edit Tournament settings</PageHeading> */}

      <TournamentEdit data={data} />
    </div>
  );
}
