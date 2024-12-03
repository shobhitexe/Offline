"use client";

import { Button, FormInput, LoadingSpinner, useToast } from "@repo/ui";
import { ReactNode, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { editAgentAction } from "./editAgentAction";
import fetcher from "@/lib/setup";
import useSWR from "swr";

export default function EditAgent({ id }: { id: string }) {
  const session = useSession();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const ref = useRef<null | HTMLFormElement>(null);

  const { data, mutate } = useSWR<{
    data: {
      name: string;
      username: string;
      balance: string;
      sportsShare: string;
      childLevel: string;
      marketCommission: string;
      sessionCommission: string;
      createdAt: string;
    };
  }>(`/admin?id=${id}`, fetcher);

  async function createAgentClientAction(formdata: FormData) {
    try {
      setLoading(true);

      const res = await editAgentAction(formdata, id);

      if (res) {
        mutate();
        ref.current?.reset();
        toast({ description: "Agent Edited successfully" });
        return;
      }

      toast({ variant: "destructive", description: "Failed to edit agent" });
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to edit agent" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col sm:gap-10 gap-5"
      action={createAgentClientAction}
      ref={ref}
    >
      <HeadingLabel>Personal Details</HeadingLabel>
      <div className="mt-5 flex flex-wrap items-center gap-5 w-full justify-center">
        <FormInput
          name="parentName"
          type="text"
          id="parentName"
          placeholder={session.data?.user.name || ""}
          disabled
          value={`${session.data?.user.name} [${session.data?.user.username}]`}
          label="Parent Name"
        />

        <FormInput
          type="text"
          name="name"
          id="name"
          required
          defaultValue={data?.data.name}
          placeholder={"Full Name"}
          label="Agent Name"
        />

        <FormInput
          type="text"
          id="username"
          name="username"
          placeholder={"Username"}
          value={data?.data.username}
          label="Username"
          disabled
        />

        {/* <FormInput
          type="password"
          id="password"
          name="password"
          placeholder={"Enter Password"}
          label="Password"
          disabled
        /> */}

        <FormInput
          type="number"
          id="credit"
          name="credit"
          placeholder={"Opening Balance"}
          label="Credit Reference"
          disabled
        />

        <FormInput
          type="number"
          id="point"
          name="point"
          placeholder={"Point"}
          value={1}
          disabled
          label="Point"
        />

        <FormInput
          type="text"
          name="childLevel"
          id="childLevel"
          disabled
          value={data?.data.childLevel}
          placeholder={"Child Level"}
          label="Child Level"
        />
      </div>

      <HeadingLabel>Commission Type</HeadingLabel>

      <div className="mt-5 flex flex-wrap items-center gap-5 w-full justify-center">
        <FormInput
          type="number"
          id="marketCommission"
          name="marketCommission"
          placeholder={"Please Enter Market Commission"}
          label="Market Commission"
          disabled
          value={data?.data.marketCommission}
        />
        <FormInput
          type="number"
          id="sessionCommission"
          name="sessionCommission"
          placeholder={"Please Enter Session Commission"}
          label="Session Commission"
          value={data?.data.sessionCommission}
          disabled
        />
      </div>

      <Button className="w-fit">{loading ? <LoadingSpinner /> : "Edit"}</Button>
    </form>
  );
}

function HeadingLabel({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary/10 py-2 px-3 rounded-lg w-full text-sm">
      {children}
    </div>
  );
}
