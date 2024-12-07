import { universalPOST } from "../requests";

export const claimBonus = async (id: string) => {
  const response = await universalPOST(`/api/bonus/claim/bonus`, {
    id,
  });

  if (response.data === true) {
    return true;
  } else {
    return response;
  }
};
