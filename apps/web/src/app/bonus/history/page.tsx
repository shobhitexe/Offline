import { options } from "@/app/api/auth/[...nextauth]/options";
import { BonusHistoryColumns } from "@/components/Bonus/Bonushistory";
import { BackendURL } from "@/config/env";
import { BonusHistoryTableType } from "@repo/types";
import { DataTable } from "@repo/ui";
import { getServerSession } from "next-auth";

async function getBonusHistory(id: string) {
  try {
    const response = await fetch(`${BackendURL}/api/bonus/history?id=${id}`, {
      method: "GET",
    });

    if (response.status !== 200) {
      return [];
    }

    const res = await response.json();

    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const session = await getServerSession(options);
  const history: BonusHistoryTableType[] = await getBonusHistory(
    session?.user._id || ""
  );

  return (
    <div>
      <DataTable
        columns={BonusHistoryColumns}
        data={history}
        isSearch={false}
      />
    </div>
  );
}
