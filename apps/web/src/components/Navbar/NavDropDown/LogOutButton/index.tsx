"use client";

import { LogoutIcon } from "@repo/ui";
import { signOut, useSession } from "next-auth/react";

export default function LogOut() {
  const session = useSession();

  return (
    <>
      {session.status === "authenticated" && (
        <div className="py-1 flex items-center gap-3 cursor-pointer">
          <LogoutIcon width={24} height={24} />
          <div onClick={() => signOut()} className="text-sm font-medium">
            Logout
          </div>
        </div>
      )}
    </>
  );
}
