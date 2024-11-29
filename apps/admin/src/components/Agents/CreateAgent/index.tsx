"use client";

import { Button, FormInput, LoadingSpinner, useToast } from "@repo/ui";
import { ReactNode, useRef, useState } from "react";
import SelectChildLevel from "./SelectLevel";
import { useSession } from "next-auth/react";
import { createAgentAction } from "./createAgentAction";

export default function CreateAgent() {
  const session = useSession();

  const { update } = useSession();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const ref = useRef<null | HTMLFormElement>(null);

  async function createAgentClientAction(formdata: FormData) {
    try {
      setLoading(true);

      const res = await createAgentAction(formdata, session.data?.user.id!);

      if (res) {
        await update({
          ...session,
          user: {
            ...session.data?.user,
            sportsShare:
              Number(session.data?.user.sportsShare) -
              Number(formdata.get("sportsShare")),
          },
        });

        ref.current?.reset();
        toast({ description: "Agent Created successfully" });
        return;
      }

      toast({ variant: "destructive", description: "Failed to create agent" });
    } catch (error) {
      toast({ variant: "destructive", description: "Failed to create agent" });
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
          placeholder={"Full Name"}
          label="Agent Name"
        />

        <FormInput
          type="text"
          id="username"
          name="username"
          placeholder={"Username"}
          label="Username"
          required
        />

        <FormInput
          type="password"
          id="password"
          name="password"
          placeholder={"Enter Password"}
          label="Password"
          required
        />

        <FormInput
          type="number"
          id="credit"
          name="credit"
          placeholder={"Opening Balance"}
          label="Credit Reference"
          required
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

        <div className="grid w-full max-w-sm items-center">
          <label className="text-sm">Child Level</label>
          <SelectChildLevel />
        </div>
      </div>

      <HeadingLabel>Sharing</HeadingLabel>

      <div className="mt-5 flex flex-wrap items-center gap-5 w-full justify-center">
        <FormInput
          type="number"
          id="sportsShare"
          name="sportsShare"
          placeholder={"Please Enter Sports Share"}
          label="Sports Share"
          required
        />
        <FormInput
          type="number"
          id="parentSportsShare"
          name="parentSportsShare"
          placeholder={"Sports Share"}
          value={session.data?.user.sportsShare}
          disabled
          label="Parent Sports Share"
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
          required
        />
        <FormInput
          type="number"
          id="sessionCommission"
          name="sessionCommission"
          placeholder={"Please Enter Session Commission"}
          label="Session Commission"
          required
        />
      </div>

      <Button className="w-fit">
        {loading ? <LoadingSpinner /> : "Create"}
      </Button>
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
