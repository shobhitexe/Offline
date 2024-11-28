"use server";

import { universalPOST } from "@/lib/requests";
import { revalidatePath } from "next/cache";

export async function createAgentAction(formdata: FormData, id: string) {
  try {
    const data = {
      name: formdata.get("name"),
      username: formdata.get("username"),
      password: formdata.get("password"),
      credit: Number(formdata.get("credit")),
      childLevel: Number(formdata.get("childLevel")),
      sportsShare: Number(formdata.get("sportsShare")),
      marketCommission: Number(formdata.get("marketCommission")),
      sessionCommission: Number(formdata.get("sessionCommission")),
    };

    const res = await universalPOST("/admin/agent/create", {
      ...data,
      addedBy: id,
    });

    if (res.data) {
      return res.data;
    }

    return false;
  } catch (error) {
    return false;
  }
}
