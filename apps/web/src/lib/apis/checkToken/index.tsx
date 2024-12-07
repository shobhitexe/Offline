import { BackendURL } from "@/config/env";

export async function checkToken(id: string | unknown) {
  try {
    const res = await fetch(`${BackendURL}/api/auth/check/token?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
