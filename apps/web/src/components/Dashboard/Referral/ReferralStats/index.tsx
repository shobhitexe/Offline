"use client";

import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function ReferralStats() {
  const session = useSession();

  const { data } = useSWR<{
    data: { referred: number; totalLinkViews: number };
  }>(
    `${BackendURL}/api/referral/total/referred?id=${session.data?.user.id}`,
    fetcher
  );

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto">
      <div className="text-xl border-b border-b-white/20 w-full mx-auto text-center pb-5">
        Overview
      </div>
      <div className="grid grid-cols-3 items-center gap-5 justify-around w-full mt-5 text-center">
        <div className="p-3 rounded-sm shadow-md w-full max-sm:max-w-xs">
          <div className="capitalize sm:text-xl text-sm">Total Referred</div>
          <div className="sm:text-3xl text-lg">{data?.data.referred || 0}</div>
        </div>
        <div className="p-3 rounded-sm shadow-md w-full max-sm:max-w-xs">
          <div className="capitalize sm:text-xl text-sm whitespace-normal">
            Total Bonus Earned
          </div>
          <div className="sm:text-3xl text-lg">
            {data?.data.referred! * 100 || 0}
          </div>
        </div>

        <div className="p-3 rounded-sm shadow-md w-full max-sm:max-w-xs">
          <div className="capitalize sm:text-xl text-sm">Total Link Visits</div>
          <div className="sm:text-3xl text-lg">
            {data?.data.totalLinkViews! || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
