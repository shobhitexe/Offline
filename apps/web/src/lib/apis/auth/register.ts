import { UserType } from "@repo/types";
import { universalPOST } from "../requests";

export async function registerUser(user: UserType) {
  const response = await universalPOST(`/api/auth/register`, {
    ...user,
  });

  if (response.data === true) {
    return true;
  } else {
    return response;
  }
}

export async function verifyOldPassword(
  phone: string,
  email: string,
  password: string
) {
  const response = await universalPOST(`/api/auth/verify/oldpassword`, {
    phone,
    email,
    password,
  });

  if (response.data === true) {
    return true;
  } else {
    return response;
  }
}

export async function changePassword(data: UserType) {
  const response = await universalPOST(`/api/auth/change/password`, {
    ...data,
  });

  if (response.data === true) {
    return true;
  } else {
    return response;
  }
}
