"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import fetcher from "@/lib/setup";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormInput,
  Skeleton,
  useToast,
} from "@repo/ui";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { DepositCreditAction } from "./depositCreditAction";

export default function DepositCredit({ id }: { id: string }) {
  const session = useSession();

  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<null | HTMLFormElement>(null);

  const { balance, setBalance } = useGlobalContext();

  const { data } = useSWR<{ data: string }>(
    balance === "NaN" && isOpen
      ? `/admin/wallet/balance?id=${session.data?.user.id}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data?.data && balance === "NaN") {
      setBalance(data.data);
    }
  }, [data, balance, setBalance]);

  const {
    data: userData,
    mutate,
    isLoading,
  } = useSWR<{
    data: {
      name: string;
      username: string;
      balance: string;
      addedByName: string;
      addedByUsername: string;
      addedByBalance: number;
    };
  }>(isOpen ? `/user?id=${id}` : null, fetcher);

  async function FormActionClient(formdata: FormData) {
    try {
      if (Number(formdata.get("amount")) > Number(balance)) {
        toast({
          title: "Can't Transfer",
          description: "Insufficient balance",
          variant: "destructive",
        });
        return;
      }

      const res = await DepositCreditAction(
        formdata,
        session.data?.user.id!,
        id
      );

      if (res !== true) {
        toast({
          description: "Failed to allocate chips",
          variant: "destructive",
        });
        return;
      }

      toast({ description: "Amount credited" });

      // setBalance(Number(balance) - Number(formdata.get("amount")));

      mutate();

      ref.current?.reset();
    } catch (error) {
      toast({
        description: "Failed to allocate chips",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className="ui-py-1.5 ui-text-sm ui-px-2 bg-yellow-500 p-1 rounded">
        D
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {isLoading ? (
            <Skeleton className="h-7" />
          ) : (
            <DialogTitle>{`${userData?.data.name} [${userData?.data.username}]`}</DialogTitle>
          )}

          <form
            method="POST"
            className="pt-5 flex flex-col gap-5"
            action={FormActionClient}
            ref={ref}
          >
            <FormInput
              name="amount"
              type="number"
              id="amount"
              placeholder={"Enter Chips"}
              label="Deposit Credit"
              required
              containerClassname="max-w-full"
            />

            {isLoading ? (
              <Skeleton className="h-10" />
            ) : (
              <FormInput
                name="agentName"
                type="text"
                id="agentName"
                value={userData?.data.addedByBalance}
                disabled
                label={`${userData?.data.addedByName} [${userData?.data.addedByUsername}]`}
              />
            )}

            {isLoading ? (
              <Skeleton className="h-10" />
            ) : (
              <FormInput
                name="userName"
                type="text"
                id="userName"
                value={userData?.data.balance}
                disabled
                label={`${userData?.data.name} [${userData?.data.username}]`}
              />
            )}

            <FormInput
              name="remarks"
              type="text"
              id="remarks"
              placeholder={"Enter Remarks"}
              label="Remarks"
              required
              containerClassname="max-w-full"
            />

            <Button>Deposit</Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
