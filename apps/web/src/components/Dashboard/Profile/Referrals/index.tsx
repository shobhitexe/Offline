"use client";

import { ClipboardIcon, Toaster, useToast } from "@repo/ui";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function Referrals() {
  const session = useSession();
  const { toast } = useToast();

  const [isDOMLoaded, setIsDOMLoaded] = useState(false);

  useEffect(() => {
    setIsDOMLoaded(true);
  }, []);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/refer/${session.data?.user.uniqueCode}`
    );

    toast({ title: "Copied to clipboard", variant: "default" });
  }

  return (
    <div className="text-main flex justify-between w-full items-center gap-1 bg-cardBG sm:p-5 p-2 rounded-lg sm:text-base text-xs">
      <div>
        {isDOMLoaded && window.location.origin}/refer/
        {session.data?.user.uniqueCode}
      </div>
      <ClipboardIcon
        width={20}
        className="cursor-pointer"
        onClick={copyToClipboard}
      />
    </div>
  );
}
