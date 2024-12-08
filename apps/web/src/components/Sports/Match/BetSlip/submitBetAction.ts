"use server";

export async function submitBetAction(
  matchId: string,
  userId: string,
  oddsPrice: number,
  oddsRate: Number,
  betType: string,
  amount: number,
  marketName: string,
  marketId: string,
  runnerName: string,
  runnerID: string,
  marketType: string
) {
  try {
    const res = await fetch(`http://localhost:8080/api/v1/sports/placebet`, {
      method: "POST",
      body: JSON.stringify({
        matchId,
        userId,
        oddsPrice,
        oddsRate,
        betType,
        amount: Number(amount),
        marketName,
        marketId,
        runnerName,
        runnerID,
        marketType,
      }),
    });

    if (res.status !== 200) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
