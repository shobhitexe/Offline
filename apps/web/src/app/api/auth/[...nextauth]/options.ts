import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
        // "2fa-key": { label: "2FA Key" },
      },
      async authorize(credentials, req) {
        const loginIP = req.headers ? req.headers["x-forwarded-for"] : "null";
        const userAgent = req.headers ? req.headers["user-agent"] : "null";

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({ ...credentials, loginIP, userAgent }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const userArray = await response.json();

        console.log(userArray);

        const { data } = userArray;

        if (response.status === 200) {
          return data;
        } else {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;

      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
};
