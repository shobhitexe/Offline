"use client";

import Link from "next/link";
import Image from "next/image";
import { Input, Button, LoadingSpinner } from "@repo/ui";
import { FormEvent, useState } from "react";
import { changeHandler } from "@/lib/changeHandler";
import { signIn } from "next-auth/react";

export default function LoginPage() {
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
    <form
      onSubmit={submitHandler}
      className="min-h-screen grid md:grid-cols-2 bg-[#0D0628]"
    >
      <div className="relative hidden md:flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="relative w-96 h-96">
          <Image
            src="/images/login/bg.png"
            alt="Casino gaming elements"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center mt-8">
          <h2 className="text-[#00FFC2] text-4xl font-bold mb-2">CENTURY99</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Your favorite games are waiting for you on this platform, play with
            love, win by playing.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-[#01050F] relative -top-10 h-full">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden text-center mb-8">
            <h2 className="text-[#00FFC2] text-3xl font-bold">CENTURY99</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Log in
              </h1>
              <p className="text-sm text-gray-400">
                Welcome! Please enter your details
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-blue-500"
                  htmlFor="username"
                >
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  value={loginData.username}
                  onChange={handleChange}
                  placeholder="Please enter your username"
                  className="text-white placeholder:text-gray-500"
                  style={{ backgroundColor: "#1A1039", border: "#2A1F4C" }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium text-blue-500"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={loginData.password}
                  type="password"
                  placeholder="Please enter your password"
                  className="text-white placeholder:text-gray-500"
                  style={{ backgroundColor: "#1A1039", border: "#2A1F4C" }}
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? (
                  <LoadingSpinner className="mx-auto" />
                ) : (
                  <div className="flex items-center gap-2 font-medium">
                    Start Playing
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
