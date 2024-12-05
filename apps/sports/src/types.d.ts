interface Runner {
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
}

interface Market {
  MarketId: string;
  MarketName: string;
  runners: Array<Runner>;
}

interface SportsData {
  message: string;
  data: {
    BookMaker: Market;
    CompetitionId: string;
    EventId: string;
    EventName: string;
    EventTime: string;
    Fancy: Market;
    MatchOdds: Market;
    SportsId: string;
    __v: number;
    _id: string;
  };
}
