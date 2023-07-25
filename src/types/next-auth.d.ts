/* eslint-disable @typescript-eslint/no-empty-interface */
import NextAuth from "next-auth/next";

declare module "next-auth" {
    interface Session {
        user: {
            accessToken: string;
            email: string;
            exp: number;
            expires_at: number;
            iat: number;
            jti: string;
            name: string;
            provider: string;
            providerAccountId: string;
            refresh_token: string;
            scope: string;
            sub: string;
            token_type: string;
            type: string;
        }
    }
}