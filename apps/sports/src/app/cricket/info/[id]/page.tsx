import InfoComponent from "@/components/InfoComponent";

async function getInfo(id: string) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/sports/getEventDetail?eventId=${id}`
    );

    if (res.status !== 200) {
      return null;
    }

    const _res = await res.json();

    return _res;
  } catch (error) {
    return null;
  }
}

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const info: SportsData = await getInfo(id);

  return <InfoComponent info={info} />;
}
