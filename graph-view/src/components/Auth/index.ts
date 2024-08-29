import Notion from "@auth/core/providers/notion"
import NextAuth from "next-auth";
import { fetchAllNotionPages } from "../service/Notion";
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
      Notion({
          clientId: process.env.NOTION_CLIENT,
          clientSecret: process.env.NOTION_SECRET!,
          redirectUri: process.env.NOTION_REDIRECT_URL!,   
          async profile(profile, tokens){
            const { access_token, workspace_name, workspace_id } = tokens
            profile.tokens={access_token, workspace_name, workspace_id}
            return profile
          }
    })
  ],
    callbacks:{
        jwt: async ({ token, user }) => {
            user && (token.user=user)
            return token;
         },
        async session({session, token, user}) {
            const userData = token.user;   
            console.log(userData)
            //  if(userData && typeof userData === 'object' && 'tokens' in userData){

              // const data = await fetchAllNotionPages(userData?.tokens?.access_token, "Development")
              // console.log(data)
            // }
            session.user = userData as any
            
            return session;
        },
    },
    session: {
        strategy:"jwt",
    },
    debug:process.env.NODE_ENV === 'development',
})