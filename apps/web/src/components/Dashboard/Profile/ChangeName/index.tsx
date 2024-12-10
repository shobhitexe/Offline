"use client";

import { changeName } from "@/lib/apis/profile";
import { Button, Input, Label, useToast } from "@repo/ui";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ChangeName() {
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const [name, setName] = useState(session?.user.name);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await changeName(name!, session?.user.id!);

        if (res === true) {
          toast({
            variant: "default",
            description: "Name updated",
          });

          await update({
            ...session,
            user: {
              ...session?.user,
              name: name,
            },
          });

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          toast({ variant: "destructive", description: res });
        }
      }}
      className="sm:grid flex grid-cols-3 items-center justify-items-start flex-col gap-3 mt-5"
    >
      {" "}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          name="name"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="number">Username (Read only)</Label>
        <Input
          id="username"
          type="text"
          name="username"
          disabled
          value={session?.user.username || ""}
        />
      </div>
      <br />
      <Button size={"lg"}>Update Profile</Button>
    </form>
  );
}
