"use server";

import { universalPOST } from "@/lib/requests";

export async function editAgentAction(formdata: FormData, id: string) {
  try {
    const data = {
      name: formdata.get("name"),
    };

    const res = await universalPOST("/admin/agent/edit", {
      ...data,
      id: id,
    });

    if (res.data) {
      return res.data;
    }

    return false;
  } catch (error) {
    return false;
  }
}
