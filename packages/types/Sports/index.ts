export type BetHistoryPerGame = {
  selection: string;
  odds: number;
  stake: number;
  pnl: number;
  betType: string;
};

export type GroupedBetHistoryPerGame = {
  Bookmaker: Record<string, number>;
  Fancy: Record<string, number>;
  MatchOdds: Record<string, number>;
};
