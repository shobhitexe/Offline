"use client";

import { Button, Input } from "@repo/ui";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type SignInPageProps = {
  searchParams?: Record<"callbackurl" | "error", string>;
};

export default function SignInPage({ searchParams }: SignInPageProps) {
  const callbackUrl = searchParams?.callbackurl || "/dashboard";

  const [isPassVisible, setIsPassVisible] = useState(false);

  const [btnCLicked, setIsBtnClicked] = useState(false);

  return (
    <form
      action={async (e) => {
        setIsBtnClicked(true);

        const loginData = {
          username: e.get("username"),
          password: e.get("password"),
        };

        const res = await signIn("credentials", {
          ...loginData,
          redirect: true,
          callbackUrl: callbackUrl,
        });
      }}
      className="flex flex-col justify-center items-center z-20 relative gap-7 w-full"
    >
      <div className="grid w-full items-center gap-1 mt-2">
        <label
          htmlFor="username"
          className="text-white text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Username
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Username"
          name="username"
          required
        />
      </div>
      <div className="grid w-full items-center gap-1 relative">
        <label
          htmlFor="password"
          className="text-white text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Password
        </label>
        <Input
          id="password"
          type={isPassVisible ? "text" : "password"}
          placeholder="Password"
          name="password"
          required
        />
        <div className="absolute right-2 top-1/2 cursor-pointer">
          {isPassVisible ? (
            <EyeOff
              className="w-5 h-5"
              onClick={() => setIsPassVisible(false)}
            />
          ) : (
            <Eye className="w-5 h-5" onClick={() => setIsPassVisible(true)} />
          )}
        </div>
      </div>

      <Button
        variant="yellow"
        className="w-full mt-2 ui-text-white"
        disabled={btnCLicked}
      >
        Sign In
      </Button>
    </form>
  );
}
