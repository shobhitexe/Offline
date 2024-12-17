"use server";

import { universalPOST } from "@/lib/requests";
import { revalidatePath } from "next/cache";

export async function changeOpenMarketStatus(eventId: string) {
  try {
    const res = await universalPOST(`/admin/sports/openMarket`, {
      eventId,
    });

    console.log(res);

    if (!res.data) {
      return false;
    }

    revalidatePath("/open-market");

    return true;
  } catch (error) {
    return false;
  }
}
