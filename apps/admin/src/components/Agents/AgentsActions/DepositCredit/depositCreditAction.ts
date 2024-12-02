"use server";

import { universalPOST } from "@/lib/requests";

export async function DepositCreditAction(
  formdata: FormData,
  from: string,
  to: string
) {
  try {
    const data = {
      amount: Number(formdata.get("amount")),
      from: from,
      to: to,
      remarks: formdata.get("remarks"),
    };

    const res = await universalPOST("/admin/wallet/credit/admin", data);

    if (res.data) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
