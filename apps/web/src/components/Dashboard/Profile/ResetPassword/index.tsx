"use client";

import { changePassword, verifyOldPassword } from "@/lib/apis/auth/register";
import { changeHandler } from "@/lib/changeHandler";
import {
  Button,
  Input,
  Label,
  LoadingSpinner,
  Toaster,
  useToast,
} from "@repo/ui";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ResetPassword() {
  const session = useSession();
  const { toast } = useToast();

  const [data, setData] = useState({
    password: "",
    // otp: "",
    newpassword: "",
    confirmNewPass: "",
  });

  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = changeHandler(setData);

  return (
    <div>
      <form
        className="mt-5 flex flex-col gap-5"
        method="POST"
        onSubmit={async (event) => {
          event.preventDefault();

          if (data.newpassword !== data.confirmNewPass) {
            toast({
              variant: "destructive",
              description: "Passwords do not match",
            });

            return;
          }

          // const res = await changePassword({
          //   ...data,
          //   email: session.data?.user.email!,
          //   phone: session.data?.user.phone!,
          // });
          // if (res === true) {
          //   toast({
          //     variant: "default",
          //     description: "Password changed",
          //   });
          //   setTimeout(() => {
          //     window.location.reload();
          //   }, 2000);
          // } else {
          //   toast({ variant: "destructive", description: res.toString() });
          // }
        }}
      >
        {!isOTPRequested && (
          <div className="grid w-full items-center gap-1.5 max-w-sm">
            <Label htmlFor="password">Old Password</Label>
            <Input
              id="password"
              type="text"
              name="password"
              value={data.password}
              placeholder="********"
              onChange={handleChange}
              required
              disabled={isOTPRequested}
            />
          </div>
        )}
        {isOTPRequested && (
          <>
            {" "}
            <div className="grid w-full items-center gap-1.5 max-w-sm">
              <Label htmlFor="newpassword">New Password</Label>
              <Input
                id="newpassword"
                type="password"
                name="newpassword"
                value={data.newpassword}
                placeholder="********"
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5 max-w-sm">
              <Label htmlFor="password">Confirm New Password</Label>
              <Input
                id="confirmnewpassword"
                type="password"
                name="confirmNewPass"
                value={data.confirmNewPass}
                placeholder="********"
                onChange={handleChange}
                required
              />
            </div>
            {/* <div className="grid w-full items-center gap-1.5 max-w-sm">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="number"
                name="otp"
                value={data.otp}
                onChange={handleChange}
                required
              />
            </div> */}
          </>
        )}

        {isOTPRequested ? (
          <Button size="lg" className="w-fit">
            Update
          </Button>
        ) : (
          <Button
            type="button"
            className="w-fit"
            size="lg"
            onClick={async () => {
              setIsLoading(true);

              // const res = await verifyOldPassword(
              //   session.data?.user.phone!,
              //   session.data?.user.email!,
              //   data.password
              // );

              // if (res === true) {
              //   toast({
              //     variant: "default",
              //     description: "OTP Requested",
              //   });
              //   setIsLoading(false);
              //   setIsOTPRequested(true);
              // } else {
              //   toast({ variant: "destructive", description: res });
              //   setIsLoading(false);
              // }
            }}
          >
            {isLoading ? <LoadingSpinner className={"text-main"} /> : "Next"}
          </Button>
        )}
      </form>
    </div>
  );
}
