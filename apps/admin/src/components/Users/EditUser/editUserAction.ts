"use server";

import { universalPOST } from "@/lib/requests";

export async function editUserAction(formdata: FormData, id: string) {
  try {
    const data = {
      name: formdata.get("name"),
      marketCommission: Number(formdata.get("marketCommission")),
      id: id,
    };

    const res = await universalPOST("/admin/user/edit", {
      ...data,
    });

    if (res.data) {
      return res.data;
    }

    return false;
  } catch (error) {
    return false;
  }
}
