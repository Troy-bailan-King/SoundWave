import { SignInButton, useUser,UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { RouterOutputs } from "~/utils/api";
import { LoadingPage,LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import {toast} from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

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


const Home: NextPage = () => {
  const {isLoaded:userLoaded, isSignedIn} = useUser();
  
  // Start fetching asap
  api.posts.getAll.useQuery();

  if(!userLoaded) return <div />

  return (
    <div className="relative">
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
    <div className="absolute top-0 right-0 m-4">
    {/* New Functionality Interface */}
     123
  </div>
    </div>
  );
};

export default Home;
