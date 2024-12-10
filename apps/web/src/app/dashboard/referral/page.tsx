import { options } from "@/app/api/auth/[...nextauth]/options";
import { ReferralStats, Referrals, ReferraltableColumns } from "@/components";
import { BackendURL } from "@/config/env";
import { DataTable } from "@repo/ui";
import { getServerSession } from "next-auth";

async function fetchReferraldata(id: string) {
  try {
    const res = await fetch(`${BackendURL}/api/referral/referraldata?id=${id}`);

    if (res.status !== 200) {
      return [];
    }

    const _res = await res.json();

    return _res.data.referred;
  } catch (error) {
    return [];
  }
}

export default async function page() {
  const session = await getServerSession(options);

  const data = await fetchReferraldata(session?.user.id!);

  // console.log(data);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2 border-y border-white/20 sm:py-10 py-5">
        <div className="whitespace-nowrap">My Referral Link</div>{" "}
        <div className="bg-lightButton sm:p-3 rounded-xl shadow-xl w-full">
          <Referrals />
        </div>
      </div>

      <div className="sm:text-4xl xs:text-2xl text-xl underline sm:py-10 py-5">
        My Invitations
      </div>

      <ReferralStats />

      <div className="sm:text-4xl xs:text-2xl text-xl underline sm:py-10 py-5 sm:mt-10">
        Referral & Earn History
      </div>

      <DataTable
        columns={ReferraltableColumns}
        data={data || []}
        varient="brown"
      />
    </div>
  );
}
