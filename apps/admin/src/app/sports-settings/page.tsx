import { SportsSettingsTable } from "@/components";
import { universalGET } from "@/lib/requests";

async function getData() {
  try {
    const res = await universalGET(`/admin/settings/sports`);

    if (!res.data) {
      return null;
    }

    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const data = await getData();

  return <SportsSettingsTable settingsdata={data} />;
}
