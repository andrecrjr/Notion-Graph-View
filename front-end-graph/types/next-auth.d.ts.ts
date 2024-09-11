import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      tokens: {
        access_token?: string;
      };
    } & DefaultSession["user"];
  }
}
