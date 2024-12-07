import NextAuth from "next-auth";

type sessionUser = {
  _id?: string;
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
  matchName: string;
  eventId: string;
  matchType: string;
  openingTime: string;
};
