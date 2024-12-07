"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const session = await getServerSession(options);

  const res = await fetch(input, init);
  return res.json();
}
