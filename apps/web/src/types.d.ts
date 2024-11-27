import NextAuth from "next-auth";

type sessionUser = {
  id?: string;
  name?: string | null | undefined;
  username?: string;
  token?: string;
  sportsShare?: number;
};

declare module "next-auth" {
  interface Session {
    user: sessionUser;
  }
  interface nextauth {
    token: string;
  }
}
