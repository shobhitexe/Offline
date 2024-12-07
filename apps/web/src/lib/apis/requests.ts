import { BackendURL } from "@/config/env";

export async function universalPOST(url: string, data?: any) {
  try {
    const response = await fetch(`${BackendURL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      ...(data ? { body: JSON.stringify(data) } : {}),
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
    console.error("Error occurred during POST request:", error);

    return error;
  }
}
