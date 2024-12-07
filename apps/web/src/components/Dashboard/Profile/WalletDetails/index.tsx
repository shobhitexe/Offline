"use client";

import { BackendURL } from "@/config/env";
import fetcher from "@/lib/data/setup";
import { InputWalletDetailsType } from "@repo/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";
import { PencilIcon } from "@repo/ui";

export default function WalletDetails() {
  const session = useSession();

  const { data } = useSWR<{ data: InputWalletDetailsType }>(
    `${BackendURL}/api/wallet/check/details/present?id=${session.data?.user._id}`,
    fetcher
  );

  return (
    <div>
      <div className="text-[#B8A8BD] font-satoshiRegular text-xs">
        WITHDRAWAL DETAILS
      </div>
      <div className="bg-lightButton px-3 py-2 rounded-sm mt-3">
        <div className="flex flex-col gap-2">
          <div className="text-[#B8A8BD] font-satoshiRegular flex items-center gap-1">
            <div>Name :</div>{" "}
            <div className="text-white">{data?.data.name}</div>
          </div>
          <div className="bg-[#322735] w-full h-[2px]" />
          <div className="text-[#B8A8BD] font-satoshiRegular flex items-center gap-1">
            <div>Account Type :</div>{" "}
            <div className="text-white">{data?.data.accountType}</div>
          </div>
          <div className="bg-[#322735] w-full h-[2px]" />
          <div className="text-[#B8A8BD] font-satoshiRegular flex items-center gap-1">
            <div>Account Number :</div>{" "}
            <div className="text-white">{data?.data.accountNumber}</div>
          </div>
          <div className="bg-[#322735] w-full h-[2px]" />
          <div className="text-[#B8A8BD] font-satoshiRegular flex items-center gap-1">
            <div>IFSC Code :</div>{" "}
            <div className="text-white">{data?.data.IFSCcode}</div>
          </div>
          <div className="bg-[#322735] w-full h-[2px]" />
          <div className="text-[#B8A8BD] font-satoshiRegular flex items-center gap-3">
            <div>Change Details :</div>{" "}
            <div className="text-white">
              <Link
                href={"/dashboard/profile/update/withdrawaldetails"}
                className="ui-flex ui-items-center ui-gap-2 ui-border ui-border-white/20 ui-py-1 ui-px-2 ui-rounded-sm ui-cursor-pointer"
              >
                <PencilIcon />
                <div className="ui-text-sm">Set/Update</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
