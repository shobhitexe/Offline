"use client";

import { Button, LoadingSpinner } from "@repo/ui";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type SignInPageProps = {
  searchParams?: Record<"callbackurl" | "error", string>;
};

import { Card, CardContent, Input, Label } from "@repo/ui";
import Image from "next/image";

export default function SignInPage({ searchParams }: SignInPageProps) {
  const callbackUrl = searchParams?.callbackurl || "/dashboard";

  const [isPassVisible, setIsPassVisible] = useState(false);

  const [btnCLicked, setIsBtnClicked] = useState(false);

  return (
    <div className={"flex flex-col gap-6"}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
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
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 items-center text-center">
                <Image
                  src={"/images/logo.jpeg"}
                  width={474}
                  height={110}
                  alt="logo"
                  className="w-2/3"
                />
                <p className="text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  name="username"
                  required
                />
              </div>
              <div className="grid gap-2 relative">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
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
                    <Eye
                      className="w-5 h-5"
                      onClick={() => setIsPassVisible(true)}
                    />
                  )}
                </div>
              </div>
              <Button disabled={btnCLicked} type="submit" className="w-full">
                {btnCLicked ? <LoadingSpinner /> : "Login"}
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/images/auth/signin2.avif"
              alt="Image"
              width={2560}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover brightness-[0.2]s grayscales"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
