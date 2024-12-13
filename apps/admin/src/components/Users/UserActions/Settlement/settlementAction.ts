"use server";

import { universalPOST } from "@/lib/requests";

export async function settlementAction(
  formdata: FormData,
  cash: number,
  fromId: string,
  toId: string,
  txnType: string
) {
  const data = {
    cash,
    fromId,
    toId,
    txnType,
    remarks: formdata.get("remarks"),
    password: formdata.get("password"),
  };

  try {
    const res = await universalPOST("/admin/wallet/settlement/user", data);

    console.log(res);

    if (res.data !== true) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function settlementActionAgent(
  formdata: FormData,
  cash: number,
  fromId: string,
  toId: string,
  txnType: string
) {
  const data = {
    cash,
    fromId,
    toId,
    txnType,
    remarks: formdata.get("remarks"),
    password: formdata.get("password"),
  };

  try {
    const res = await universalPOST("/admin/wallet/settlement/agent", data);

    console.log(res);

    if (res.data !== true) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
