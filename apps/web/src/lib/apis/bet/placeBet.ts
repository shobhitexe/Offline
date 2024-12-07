import { universalPOST } from "../requests";

export const placeBet = async (
  id: string,
  amount: number,
  type: string,
  walletType: string
) => {
  const response = await universalPOST(`/api/bet/new/bet`, {
    id,
    amount,
    type,
    walletType,
  });

  if (response.message === "Bet placed") {
    return response.data;
  } else {
    return response;
  }
};
