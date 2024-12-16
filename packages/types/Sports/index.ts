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
