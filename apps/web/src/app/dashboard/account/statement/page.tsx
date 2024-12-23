import { options } from "@/app/api/auth/[...nextauth]/options";
import { BetStatementColumns, DashboardHeading, Statement } from "@/components";
import { BackendURL } from "@/config/env";
import { DataTable } from "@repo/ui";
import { getServerSession } from "next-auth";
import React from "react";

async function getStatement(
  id: string,
  from: string,
  to: string,
  gameType: string,
  marketType: string
) {
  try {
    const res = await fetch(
      `${BackendURL}/api/v1/user/statement?id=${id}&from=${from}&to=${to}&gameType=${gameType}&marketType=${marketType}`
    );

    if (res.status !== 200) {
      return [];
    }

    const _res = await res.json();

    return _res.data;
  } catch (error) {
    return [];
  }
}

export default async function AccountStatement({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(options);

  const params = {
    from: (searchParams["from"] as string) || new Date().toISOString(),
    to: (searchParams["to"] as string) || new Date().toISOString(),
    gameType: (searchParams["gameType"] as string) || "all",
    marketType: (searchParams["marketType"] as string) || "all",
  };

  const statement = await getStatement(
    session?.user.id!,
    params.from,
    params.to,
    params.gameType,
    params.marketType
  );

  console.log(statement);

  return (
    <div className="w-[95%] mx-auto">
      <DashboardHeading heading={"Account Statement"} />

      <div className="flex flex-col gap-5 sm:py-10 py-5 sm:px-5 px-3 rounded-xl mt-5 bg-cardBG">
        <Statement />
        <DataTable columns={BetStatementColumns} data={[]} />
      </div>
    </div>
  );
}
