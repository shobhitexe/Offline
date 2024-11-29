"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { BackendURL } from "@/config/env";
import { getServerSession } from "next-auth";

export async function universalPOST(url: string, data: any) {
  const session = await getServerSession(options);

  try {
    const response = await fetch(`${BackendURL}/api/v1${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.token}`,
      },

      ...(data ? { body: JSON.stringify(data) } : {}),
    });

    const res = await response.json();

    if (!response.ok) {
      let errorMessage = "Unknown error occurred";

      try {
        const errorDetails = res.message;

        if (Array.isArray(errorDetails) && errorDetails[0]?.message) {
          errorMessage = errorDetails[0].message;
        } else {
          errorMessage = res.message || errorMessage;
        }

        console.error("Error message from server:", errorMessage);
      } catch (parseError) {
        console.error("Error parsing server error message:", parseError);
        errorMessage =
          res.message ||
          "An error occurred, and the error message could not be parsed.";
      }

      return errorMessage;
    }

    return res;
  } catch (error) {
    console.error("Error occurred during POST request:", error);

    return error;
  }
}

export async function universalGET(url: string) {
  const session = await getServerSession(options);

  try {
    const response = await fetch(`${BackendURL}/api/v1${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    const res = await response.json();

    if (!response.ok) {
      let errorMessage = "Unknown error occurred";

      try {
        const errorDetails = JSON.parse(res.message);

        if (Array.isArray(errorDetails) && errorDetails[0]?.message) {
          errorMessage = errorDetails[0].message;
        } else {
          errorMessage = res.message || errorMessage;
        }

        console.error("Error message from server:", errorMessage);
      } catch (parseError) {
        console.error("Error parsing server error message:", parseError);
        errorMessage =
          res.message ||
          "An error occurred, and the error message could not be parsed.";
      }

      return errorMessage;
    }

    return res;
  } catch (error) {
    console.error("Error occurred during GET request:", error);

    return error;
  }
}
