"use client";

import { Bonuscard } from "@/components";
import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import { BonusType } from "@repo/types";
import { Toaster } from "@repo/ui";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function page() {
  const session = useSession();

  const { data } = useSWR<{ data: BonusType[] }>(
    `${BackendURL}/api/bonus/mybonuses?id=${session.data?.user.id}`,
    fetcher
  );

  return (
    <div className="flex items-center flex-wrap gap-5">
      {data?.data.map((item) => <Bonuscard key={item._id} {...item} />)}
    </div>
  );
}
