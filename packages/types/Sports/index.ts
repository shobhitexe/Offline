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
