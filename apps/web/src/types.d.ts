import NextAuth from "next-auth";

type sessionUser = {
  id?: string;
  username?: string;
  name?: string | null | undefined;
  // token?: string;
};

declare module "next-auth" {
  interface Session {
    user: sessionUser;
  }
  interface nextauth {
    token: string;
  }
}

type EventType = {
  eventName: string;
  eventId: string;
  eventTime: string;
  category: string;
  MatchOdds: {
    MarketId: string;
    runners: Array<Runner>;
  };
};

type SportsData = {
  BookMaker: Market;
  CompetitionId: string;
  EventId: string;
  EventName: string;
  EventTime: string;
  Fancy: Market;
  MatchOdds: Market;
  SportsId: string;
};

type Runner = {
  Back: {
    Price: number;
    Rate: number;
  };
  Lay: {
    Price: number;
    Rate: number;
  };
  RunnerId: string;
  RunnerName: string;
  Status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

type Market = {
  MarketId: string;
  MarketName: string;
  runners: Array<Runner>;
};

export type CombinedMatchSettings = {
  tournamentName: string; // `json:"tournamentName"`
  maxStake: number; // `json:"maxStake"`
  minStake: number; // `json:"minStake"`
  beforeInPlayMaxStake: number; // `json:"beforeInPlayMaxStake"`
  beforeInPlayMinStake: number; // `json:"beforeInPlayMinStake"`
  betDelay: string; // `json:"betDelay"`
  active: boolean; // `json:"active"`
  preMOStakesMin: number; // `json:"preMOStakesMin"`
  preMOStakesMax: number; // `json:"preMOStakesMax"`
  postMOStakesMin: number; // `json:"postMOStakesMin"`
  postMOStakesMax: number; // `json:"postMOStakesMax"`
  preBMStakesMin: number; // `json:"preBMStakesMin"`
  preBMStakesMax: number; // `json:"preBMStakesMax"`
  postBMStakesMin: number; // `json:"postBMStakesMin"`
  postBMStakesMax: number; // `json:"postBMStakesMax"`
  preFancyStakesMin: number; // `json:"preFancyStakesMin"`
  preFancyStakesMax: number; // `json:"preFancyStakesMax"`
  postFancyStakesMin: number; // `json:"postFancyStakesMin"`
  postFancyStakesMax: number; // `json:"postFancyStakesMax"`
  tossStakesMin: number; // `json:"tossStakesMin"`
  tossStakesMax: number; // `json:"tossStakesMax"`
  betDelayMO: string; // `json:"betDelayMO"`
  betDelayBM: string; // `json:"betDelayBM"`
  betDelayTO: string; // `json:"betDelayTO"`
  betDelayFA: string; // `json:"betDelayFA"`
  maxProfitMO: number; // `json:"maxProfitMO"`
  maxProfitBM: number; // `json:"maxProfitBM"`
  maxProfitTO: number; // `json:"maxProfitTO"`
  maxProfitFA: number; // `json:"maxProfitFA"`
  maxOdds: number; // `json:"maxOdds"`
};
