import Notion from "@auth/core/providers/notion"
import NextAuth from "next-auth";
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Notion({
        clientId: process.env.NOTION_CLIENT,
        clientSecret: process.env.NOTION_SECRET!,
        redirectUri: process.env.NOTION_REDIRECT_URL!
  })],
})