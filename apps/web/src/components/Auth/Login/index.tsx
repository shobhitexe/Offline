"use client";

import { changeHandler } from "@/lib/changeHandler";
import { Button, FlagIcon, Input, Label, LoadingSpinner } from "@repo/ui";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { Eye, EyeOff, MoveRight } from "lucide-react";

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [isPassVisible, setIsPassVisible] = useState(false);

  const handleChange = changeHandler(setLoginData);

  async function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    const res = await signIn("credentials", {
      ...loginData,
      redirect: true,
      callbackUrl: "/",
    });
  }

  return (
    <form className="py-10 flex flex-col gap-5" onSubmit={submitHandler}>
      <div className="grid w-full items-center gap-1.5 ">
        <Label htmlFor="phone">Username*</Label>
        <Input
          id="username"
          name="username"
          placeholder="Username"
          type="text"
          required
          value={loginData.username}
          onChange={handleChange}
          className="bg-inputField text-main placeholder-[#908d8b] h-10 w-full text-sm outline-none"
        />
      </div>

      <div className="grid w-full items-center gap-1.5 relative">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={isPassVisible ? "text" : "password"}
          onChange={handleChange}
          value={loginData.password}
          className="text-main"
          name="password"
        />

        <div className="absolute right-2 top-1/2 cursor-pointer">
          {isPassVisible ? (
            <EyeOff
              className="w-5 h-5"
              stroke="#1c1817"
              onClick={() => setIsPassVisible(false)}
            />
          ) : (
            <Eye
              className="w-5 h-5"
              stroke="#1c1817"
              onClick={() => setIsPassVisible(true)}
            />
          )}
        </div>
      </div>

      <Button
        variant={"default"}
        size={"lg"}
        className="w-fit sm:self-end self-center"
      >
        {loading ? (
          <LoadingSpinner className="mx-auto" />
        ) : (
          <div className="flex items-center gap-2 font-medium">
            Login <MoveRight />
          </div>
        )}
      </Button>
    </form>
  );
}
