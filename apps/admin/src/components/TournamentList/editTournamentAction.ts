"use server";

import { universalPOST } from "@/lib/requests";

export default async function (formdata: FormData, id: number, name: string) {
  const data = {
    tournamentName: name,
    id: Number(id),
    preMOStakesMin: Number(formdata.get("preMOStakesMin")),
    preMOStakesMax: Number(formdata.get("preMOStakesMax")),
    preBMStakesMin: Number(formdata.get("preBMStakesMin")),
    preBMStakesMax: Number(formdata.get("preBMStakesMax")),
    preFancyStakesMin: Number(formdata.get("preFancyStakesMin")),
    preFancyStakesMax: Number(formdata.get("preFancyStakesMax")),
    postMOStakesMin: Number(formdata.get("postMOStakesMin")),
    postMOStakesMax: Number(formdata.get("postMOStakesMax")),
    postBMStakesMin: Number(formdata.get("postBMStakesMin")),
    postBMStakesMax: Number(formdata.get("postBMStakesMax")),
    postFancyStakesMin: Number(formdata.get("postFancyStakesMin")),
    postFancyStakesMax: Number(formdata.get("postFancyStakesMax")),
    tossStakesMin: Number(formdata.get("tossStakesMin")),
    tossStakesMax: Number(formdata.get("tossStakesMax")),
    betDelayMO: Number(formdata.get("betDelayMO")),
    betDelayBM: Number(formdata.get("betDelayBM")),
    betDelayFA: Number(formdata.get("betDelayFA")),
    betDelayTO: Number(formdata.get("betDelayTO")),
    maxProfitMO: Number(formdata.get("maxProfitMO")),
    maxProfitBM: Number(formdata.get("maxProfitBM")),
    maxProfitFA: Number(formdata.get("maxProfitFA")),
    maxProfitTO: Number(formdata.get("maxProfitTO")),
    maxOdds: Number(formdata.get("maxOdds")),
  };

  try {
    const res = await universalPOST(`/admin/settings/tournament`, { ...data });

    console.log(res);

    if (!res.data) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
