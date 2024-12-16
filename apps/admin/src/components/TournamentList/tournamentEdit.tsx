"use client";

import { TournamentSettings } from "@repo/types";
import { Button, FormInput, useToast } from "@repo/ui";
import editTournamentAction from "./editTournamentAction";

export default function TournamentEdit({ data }: { data: TournamentSettings }) {
  const { toast } = useToast();

  async function editTournamentClient(formdata: FormData) {
    try {
      const res = await editTournamentAction(
        formdata,
        data.id,
        data.tournamentName
      );

      if (res !== true) {
        toast({ description: "Failed to edit", variant: "destructive" });
        return;
      }

      toast({ description: "Edited Tournament settings" });
    } catch (error) {
      toast({ description: "Failed to edit", variant: "destructive" });
    }
  }

  return (
    <form method="POST" action={editTournamentClient} className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Edit Tournament</h1>

      <section className="border p-6 rounded-lg shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
          Tournament Details
        </h2>
        <div className="flex flex-wrap gap-5">
          <FormInput
            label="Tournament Name"
            name="tournamentName"
            type="text"
            defaultValue={data.tournamentName}
            disabled
          />
          <FormInput
            label="Tournament Id"
            name="id"
            type="text"
            defaultValue={data.id}
            disabled
          />
        </div>
      </section>

      <section className="border p-6 rounded-lg shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
          Pre Stakes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormInput
            label="Pre Match Odds Stakes Min"
            name="preMOStakesMin"
            type="number"
            defaultValue={data.preMOStakesMin}
          />
          <FormInput
            label="Pre Match Odds Stakes Max"
            name="preMOStakesMax"
            type="number"
            defaultValue={data.preMOStakesMax}
          />
          <FormInput
            label="Pre Bookmaker Stakes Min"
            name="preBMStakesMin"
            type="number"
            defaultValue={data.preBMStakesMin}
          />
          <FormInput
            label="Pre Bookmaker Stakes Max"
            name="preBMStakesMax"
            type="number"
            defaultValue={data.preBMStakesMax}
          />
          <FormInput
            label="Pre Fancy Stakes Min"
            name="preFancyStakesMin"
            type="number"
            defaultValue={data.preFancyStakesMin}
          />
          <FormInput
            label="Pre Fancy Stakes Max"
            name="preFancyStakesMax"
            type="number"
            defaultValue={data.preFancyStakesMax}
          />
        </div>
      </section>

      <section className="border p-6 rounded-lg shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
          Post Stakes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormInput
            label="Post Match Odds Stakes Min"
            name="postMOStakesMin"
            type="number"
            defaultValue={data.postMOStakesMin}
          />
          <FormInput
            label="Post Match Odds Stakes Max"
            name="postMOStakesMax"
            type="number"
            defaultValue={data.postMOStakesMax}
          />
          <FormInput
            label="Post Bookmaker Stakes Min"
            name="postBMStakesMin"
            type="number"
            defaultValue={data.postBMStakesMin}
          />
          <FormInput
            label="Post Bookmaker Stakes Max"
            name="postBMStakesMax"
            type="number"
            defaultValue={data.postBMStakesMax}
          />
          <FormInput
            label="Post Fancy Stakes Min"
            name="postFancyStakesMin"
            type="number"
            defaultValue={data.postFancyStakesMin}
          />
          <FormInput
            label="Post Fancy Stakes Max"
            name="postFancyStakesMax"
            type="number"
            defaultValue={data.postFancyStakesMax}
          />
        </div>
      </section>

      <section className="border p-6 rounded-lg shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
          Toss Stakes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Toss Stakes Min"
            name="tossStakesMin"
            type="number"
            defaultValue={data.tossStakesMin}
          />
          <FormInput
            label="Toss Stakes Max"
            name="tossStakesMax"
            type="number"
            defaultValue={data.tossStakesMax}
          />
        </div>
      </section>

      <section className="border p-6 rounded-lg shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
          Bet Delays
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormInput
            label="Bet Delay Match Odds"
            name="betDelayMO"
            type="number"
            defaultValue={data.betDelayMO}
          />
          <FormInput
            label="Bet Delay Bookmaker"
            name="betDelayBM"
            type="number"
            defaultValue={data.betDelayBM}
          />
          <FormInput
            label="Bet Delay Fancy"
            name="betDelayFA"
            type="number"
            defaultValue={data.betDelayFA}
          />
          <FormInput
            label="Bet Delay Toss"
            name="betDelayTO"
            type="number"
            defaultValue={data.betDelayTO}
          />
        </div>
      </section>

      <section className="border p-6 rounded-lg shadow-sm bg-white space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
          Max Profit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormInput
            label="Max Profit Match Odds"
            name="maxProfitMO"
            type="number"
            defaultValue={data.maxProfitMO}
          />
          <FormInput
            label="Max Profit Bookmaker"
            name="maxProfitBM"
            type="number"
            defaultValue={data.maxProfitBM}
          />
          <FormInput
            label="Max Profit Fancy"
            name="maxProfitFA"
            type="number"
            defaultValue={data.maxProfitFA}
          />
          <FormInput
            label="Max Profit Toss"
            name="maxProfitTO"
            type="number"
            defaultValue={data.maxProfitTO}
          />
        </div>
      </section>

      <section className="border p-6 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
          Max Odds
        </h2>
        <FormInput
          label="Max Odds"
          name="maxOdds"
          type="number"
          defaultValue={data.maxOdds}
        />
      </section>

      <Button>Save Changes</Button>
    </form>
  );
}
