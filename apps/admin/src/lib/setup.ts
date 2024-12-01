"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { BackendURL } from "@/config/env";
import { getServerSession } from "next-auth";

export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
  headers?: Record<string, string>
): Promise<JSON> {
  const session = await getServerSession(options);

  const res = await fetch(`${BackendURL}/api/v1${input}`, {
    ...init,
    headers: {
      ...headers,
      Authorization: `Bearer ${session?.user.token}`,
    },
  });
  return res.json();
}
