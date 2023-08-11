/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import NextAuth, { User, type NextAuthOptions } from "next-auth";
import SpotifyProvider, { SpotifyProfile } from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";
import { Session } from "inspector";
import { JWT } from "next-auth/jwt";



export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      authorization:
      'https://accounts.spotify.com/authorize?scope=playlist-modify-public',
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
   // Function to handle JWT (JSON Web Token) generation and modification
   async jwt({token, account}) {
    // If an authenticated account exists, set the JWT access token to the refresh token from the account
      if (account) {
        token.accessToken = account.refresh_token;
      }
      return token;
    },
    // Function to handle session object creation and modification
    async session({session, token}) {
      return session;
    },
  },
  // Secret key used for token encryption and decryption
  secret: process.env.NEXT_AUTH_SECRET as string,
};

export default NextAuth(authOptions);
