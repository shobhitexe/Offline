"use server";

import { universalPOST } from "@/lib/requests";

export async function changePermissions(id: string, val: boolean) {
  try {
    const res = await universalPOST(`/admin/block`, { id: id, val });

    if (res.data === "Status changed") {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
