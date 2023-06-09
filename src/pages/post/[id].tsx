import {  useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";


const SinglePostPage: NextPage = () => {
  const {isLoaded:userLoaded, isSignedIn} = useUser();
  
  // Start fetching asap
  api.posts.getAll.useQuery();

  if(!userLoaded) return <div />

  return (
    <>
      <Head>
        <title>SoundExchange</title>
        <meta name="description" content="Generated by SoundWave" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div> Post View</div>
      </main>
    </> 
  );
};

export default SinglePostPage;
