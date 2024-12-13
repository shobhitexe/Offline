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
