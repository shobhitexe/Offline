"use client";

import { DropdownMenuItem } from "@repo/ui";
import { signOut } from "next-auth/react";
import React from "react";

export default function Logout() {
  return <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>;
}
