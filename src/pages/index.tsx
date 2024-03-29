/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */


// Importing necessary libraries and components
import { SignInButton, useUser,UserButton } from "@clerk/nextjs";
import { NextApiRequest, NextApiResponse, type NextPage } from "next";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { RouterOutputs } from "~/utils/api";
import { LoadingPage,LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import {toast} from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import Login from "../components/login";
import { useSession, signOut } from "next-auth/react"
import tinycolor from "tinycolor2";
import { getToken } from "next-auth/jwt";
import { getAudioFeatures } from "~/libs/spotify";
import SpotifySearch from "~/components/spotifysearch";
import TabButton from "~/components/tabbutton";
import textColor from "~/libs/textColor";

// Extending dayjs with relativeTime plugin
dayjs.extend(relativeTime);

// Spotify client details
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

// Function to get access token from Spotify
const getAccessToken = async (refresh_token: string) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token
    })
  })

  return response.json()
}


// API handler for fetching audio features
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});
  const {query} = req;
  if (query.ids && token){
    const ids = query.ids;
    const accessToken = token.accessToken as string;
    const response = await getAudioFeatures(accessToken, ids as string);
    const {audio_features} = await response.json();
    return res.status(200).json(audio_features);
  }
  return res.status(400).json({error: "No ids provided"});
};

// Component for creating a post
const CreatePostWizard = () => {
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  const ctx = api.useContext();

  const user = useUser();

  const [input, setInput] = useState("");
  
  if(!user.isSignedIn) return null;
  return (

    <div className="flex w-full gap-3">
      <UserButton appearance={{
        elements: {
          userButtonAvatarBox: {
            width: 56,
            height: 56
          }
        }
      }} />
      <input
        placeholder="Type some Idea!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            mutate({ content: input });
          }
        }}
        disabled={isPosting}
      />
      {input !=="" &&!isPosting&&(<button onClick={() => mutate({ content: input })}>Post</button>)}
      
      {isPosting && (<div className="flex items-center"><LoadingSpinner /></div>)}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

// Component to display a post with its author
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      key={post.id}
      className="flex gap-3 border-b border-4 border-yellow-800 p-4 bg-orange-200 text-black"
      style={{ wordWrap: 'break-word' }}
    >
      <img src={author.profileImageUrl} className="h-14 w-14 rounded-full" />
      <div className="flex flex-col">
        <div className="flex gap-1 text-black-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username} `}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`·${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};


// Component to display the feed
const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  

  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col overflow-y-scroll">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};


// Component to display the home page
const Home: NextPage = () => {
  const { data: session } = useSession();
  const [startSong, setStartSong] = useState({ id: "", name: "", img: "" });
  const [endSong, setEndSong] = useState({ id: "", name: "", img: "" });
  const [openTab, setOpenTab] = useState<number>(0);
  const [startColor, setStartColor] = useState(tinycolor("#333333"));
  const [endColor, setEndColor] = useState(tinycolor("#222222"));
  console.log(session);
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <div className="relative">
      <div className="flex">
        <div className="w-full md:w-2/3">
        <PageLayout>
          <div className="flex border-b border-yellow-800 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
            {/* New Functionality Interface */}
          </div>

          <Feed />
          <div className="flex items-center justify-between p-4 text-xl">
            <a href="https://github.com/Troy-bailan-King/SoundWave">
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <div>Github</div>
              </div>
            </a>
          </div>
        </PageLayout>
        </div >
        {!session && (
                <Login />
              )}

        {session && (        
                <div className="relative flex font-main min-h-screen w-full flex-col items-center justify-start overflow-x-hidden  bg-yellow-200 text-stone-900">
                <div className="flex h-full w-5/6 flex-col items-center justify-center py-5 lg:w-3/4">
                  <div className="m-5 flex flex-row items-center justify-center ">
                    <Link href="/">
                      <span>
                        <img src="/logo.png" className="w-10 mx-3" />
                      </span>
                    </Link>
                    <h1 className="text-4xl font-semibold">
                      <b>
                        <i>SoundWave</i>
                      </b>
                    </h1>
                  </div>
                  <div className=""></div>
                  <div className=""></div>
                  <div className="flex w-full flex-row items-center justify-center font-semibold">
                    <TabButton
                      tabNumber={0}
                      color={startColor}
                      setOpenTab={setOpenTab}
                      display={openTab === 0}
                      song={startSong}
                    >
                      <h1
                        style={{ color: textColor(startColor, [tinycolor("white")]) }}
                        className="m-2 font-semibold md:text-xl"
                      >
                        Search songs
                      </h1>
                    </TabButton>
                    <TabButton
              tabNumber={1}
              color={endColor}
              setOpenTab={setOpenTab}
              display={openTab === 1}
              song={endSong}
            >
              <h1
                style={{ color: textColor(endColor, [tinycolor("white")]) }}
                className="m-2  md:text-xl"
              >
                End Song
              </h1>
            </TabButton>

            <Link
                  href={{
                    pathname: (startSong.id && endSong.id) ? "/results" : "/",
                    query: { startId: startSong.id, endId: endSong.id },
                  }}
                >
            <button
              style={{
                backgroundColor:
                  startSong.id && endSong.id
                    ? tinycolor("#1ed760").desaturate(20).toHexString()
                    : tinycolor("#1ed760").desaturate(40).toHexString(),
              }}
              className={`flex h-20 w-1/3 flex-row items-center justify-center rounded-t-2xl p-2 font-bold md:text-xl text-white border-green-100 border-l-2 border-t-2`}
              onClick={() => setOpenTab(0)}
            >
              {startSong.id && endSong.id && (

                  <a>
                    Generate your <i>Vibesition</i>
                  </a>
                
              )}
            </button>
            </Link>
                  </div>
                  <SpotifySearch
                    display={openTab == 0}
                    color={startColor}
                    setSong={setStartSong}
                    title={"First Song"}
                  />
                  <SpotifySearch
            display={openTab == 1}
            color={endColor}
            setSong={setEndSong}
            title={"Second Song"}
          />
                  <div
                    className={
                      "m-10 flex w-3/4 flex-col rounded-2xl p-4 text-center text-xl text-white md:w-1/3"
                    }
                    style={{
                      backgroundColor: tinycolor("#1ed760")
                        .desaturate(40)
                        .toHexString(),
                    }}
                  >
                    Hey, {session?.user?.name}
                    <button className="hover:text-blue-200" onClick={() => signOut()}>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
              )}        
      </div>
    </div>
  );
};
export default Home;

