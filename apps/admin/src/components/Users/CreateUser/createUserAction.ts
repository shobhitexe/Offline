"use server";

import { universalPOST } from "@/lib/requests";

export async function createUserAction(formdata: FormData, id: string) {
  try {
    const data = {
      name: formdata.get("name"),
      username: formdata.get("username"),
      password: formdata.get("password"),
      credit: Number(formdata.get("credit")),
      marketCommission: Number(formdata.get("marketCommission")),
      sessionCommission: Number(formdata.get("sessionCommission")),
    };

    const res = await universalPOST("/admin/user/create", {
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
