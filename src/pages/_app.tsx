/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    // Return the application structure
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>SoundExchange</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Toaster position="bottom-center" />
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ClerkProvider>
  );
}
// Export the MyApp component with trpc (typed RPC) integration using the "api" from "~/utils/api"
export default api.withTRPC(MyApp);


