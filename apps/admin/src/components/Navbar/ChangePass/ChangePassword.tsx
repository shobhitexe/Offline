"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  FormInput,
  useToast,
} from "@repo/ui";
import { useRef } from "react";
import changePassAction from "./changePassAction";
import { useSession } from "next-auth/react";

export default function ChangePassword() {
  const ref = useRef<null | HTMLFormElement>(null);

  const session = useSession();

  const { toast } = useToast();

  async function changePassClient(formdata: FormData) {
    try {
      const oldPass = formdata.get("currentPassword") as string;
      const newPass = formdata.get("newPassword") as string;
      const confirmNewPass = formdata.get("confirmNewPassword") as string;

      if (newPass !== confirmNewPass) {
        toast({
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      const res = await changePassAction(
        oldPass,
        newPass,
        session.data?.user.id!
      );

      if (res === true) {
        ref.current?.reset();
        toast({ description: "Password changed successfully" });
        return;
      }

      toast({
        description: res.toString() || "Failed to change password",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        description: "Failed to change password",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="ui-py-1.5 ui-text-sm ui-px-2">
        Change Password
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Change Password</DialogHeader>

        <form
          method="POST"
          className="flex flex-col gap-3"
          ref={ref}
          action={changePassClient}
        >
          <FormInput
            name="currentPassword"
            type="text"
            id="currentPassword"
            placeholder={"Enter Current password"}
            label="Old password"
            required
            containerClassname="max-w-full"
          />

          <FormInput
            name="newPassword"
            type="text"
            id="newPassword"
            placeholder={"Enter New password"}
            label="New password"
            required
            containerClassname="max-w-full"
          />

          <FormInput
            name="confirmNewPassword"
            type="text"
            id="confirmNewPassword"
            placeholder={"Confirm New password"}
            label="Confirm password"
            required
            containerClassname="max-w-full"
          />

          <Button className="mt-2">Change Password</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
