import { universalPOST } from "../requests";

export const changeName = async (name: string, id: string) => {
  const response = await universalPOST(`/api/auth/update/name`, {
    name,
    id,
  });

  if (response.data === true) {
    return true;
  } else {
    return response;
  }
};
