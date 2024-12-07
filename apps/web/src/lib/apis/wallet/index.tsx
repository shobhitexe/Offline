import { InputWalletDetailsType } from "@repo/types";
import { universalPOST } from "../requests";
import { BackendURL } from "@/config/env";

export const addWalletDetails = async (data: InputWalletDetailsType) => {
  const response = await universalPOST(`/api/wallet/add/walletdetails`, {
    ...data,
  });

  if (response.data === true) {
    return true;
  } else {
    return response;
  }
};

export const fetchAccountStatement = async (
  id: string,
  type: string,
  startDate: string,
  endDate: string,
  statementType: string
) => {
  try {
    const response = await fetch(
      `${BackendURL}/api/wallet/statement?id=${id}&type=${type}&startDate=${startDate}&endDate=${endDate}&statementType=${statementType}`
    );

    if (response.status !== 200) {
      return [];
    }

    const res = await response.json();

    if (res.data === undefined) {
      return [];
    }

    return res.data;
  } catch (error) {
    return [];
  }
};

export const depositAmount = async (data: FormData) => {
  try {
    const response = await fetch(`${BackendURL}/api/wallet/new/deposit`, {
      method: "POST",
      body: data,
    });

    if (response.status !== 200) {
      return undefined;
    }

    const res = await response.json();

    return res.data;
  } catch (error) {
    return undefined;
  }
};
