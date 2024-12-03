"use server";

import { universalPOST } from "@/lib/requests";

export default async function changePassAction(
  oldPassword: string,
  newPassword: string,
  id: string
) {
  try {
    const res = await universalPOST(`/admin/changepassword`, {
      id,
      oldPassword,
      newPassword,
    });

    if (res.data) {
      return true;
    }

    return res;
  } catch (error) {
    return false;
  }
}
