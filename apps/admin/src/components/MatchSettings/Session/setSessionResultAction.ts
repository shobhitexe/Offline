"use server";

import { universalPOST } from "@/lib/requests";

export async function setSessionResultAction(
  eventId: string,
  eventName: string,
  runnerName: string,
  runnerId: string,
  run: Number
) {
  try {
    const res = await universalPOST("/admin/sports/runner/result", {
      eventId,
      eventName,
      runnerName,
      runnerId,
      run,
    });

    if (res.data !== true) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
