export type BetHistoryPerGame = {
  selection: string;
  odds: number;
  stake: number;
  pnl: number;
  betType: string;
};

export type Fancy = {
  RunnerName: string;
  OddsRate: number;
  TotalExposure: number;
  TotalProfit: number;
  BetType: string;
  Projections: Record<string, number>;
};

export type GroupedBetHistoryPerGame = {
  Bookmaker: Record<string, number>;
  MatchOdds: Record<string, number>;
  Fancy: Fancy[];
};

export type SportsSettings = {
  id: number;
  name: string;
  maxStake: number;
  minStake: number;
  beforeInPlayMaxStake: number;
  beforeInPlayMinStake: number;
  maxOdds: number;
  betDelay: number;
};

export type TournamentSettings = {
  id: number;
  tournamentName: string;

  // Pre MO stakes
  preMOStakesMin: number;
  preMOStakesMax: number;

  // Post MO stakes
  postMOStakesMin: number;
  postMOStakesMax: number;

  // Pre BM stakes
  preBMStakesMin: number;
  preBMStakesMax: number;

  // Post BM stakes
  postBMStakesMin: number;
  postBMStakesMax: number;

  // Pre Fancy stakes
  preFancyStakesMin: number;
  preFancyStakesMax: number;

  // Post Fancy stakes
  postFancyStakesMin: number;
  postFancyStakesMax: number;

  // Toss stakes
  tossStakesMin: number;
  tossStakesMax: number;

  // Bet Delay
  betDelayMO: number;
  betDelayBM: number;
  betDelayTO: number;
  betDelayFA: number;

  // Max Profit
  maxProfitMO: number;
  maxProfitBM: number;
  maxProfitTO: number;
  maxProfitFA: number;

  // Max Odds
  maxOdds: number;
};
