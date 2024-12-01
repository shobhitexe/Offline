"use client";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { useGlobalContext } from "@/context/GlobalContext";
import fetcher from "@/lib/setup";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormInput,
} from "@repo/ui";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSWR from "swr";

export default function DepositCredit({ id }: { id: string }) {
  const session = useSession();

  const { balance, setBalance } = useGlobalContext();

  const { data } = useSWR<{ data: string }>(
    balance === "NaN"
      ? `/admin/wallet/balance?id=${session.data?.user.id}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data?.data && balance === "NaN") {
      setBalance(data.data);
    }
  }, [data, balance, setBalance]);

  const { data: userData } = useSWR<{
    data: { name: string; username: string; balance: string };
  }>(`/user?id=${id}`, fetcher);

  return (
    <Dialog>
      <DialogTrigger className="ui-py-1.5 ui-text-sm ui-px-2">
        Deposit Credit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${userData?.data.name} [${userData?.data.username}]`}</DialogTitle>

          <form className="pt-5 flex flex-col gap-5">
            <FormInput
              name="amount"
              type="number"
              id="amount"
              placeholder={"Enter Chips"}
              label="Deposit Credit"
              containerClassname="max-w-full"
            />

            <FormInput
              name="agentName"
              type="text"
              id="agentName"
              value={balance}
              disabled
              label={`${session.data?.user.name} [${session.data?.user.username}]`}
            />

            <FormInput
              name="userName"
              type="text"
              id="userName"
              value={userData?.data.balance}
              disabled
              label={`${userData?.data.name} [${userData?.data.username}]`}
            />

            <FormInput
              name="remarks"
              type="text"
              id="remarks"
              placeholder={"Enter Remarks"}
              label="Remarks"
              containerClassname="max-w-full"
            />

            <Button>Deposit</Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
