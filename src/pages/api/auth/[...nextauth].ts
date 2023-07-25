/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import NextAuth, { User, type NextAuthOptions } from "next-auth";
import SpotifyProvider, { SpotifyProfile } from "next-auth/providers/spotify";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      authorization:
      'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-modify-public',
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async jwt({token, account}) {
      return{...token, ...account};
    },
    async session({session, token}) {
      session.user = token as any;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);