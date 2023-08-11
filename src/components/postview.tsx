// Import necessary modules and types
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// Define a type to represent a post with user information
type PostWithUser = RouterOutputs["posts"]["getAll"][number];

// Component to render an individual post
export const PostView = (props: PostWithUser) => {
  // Destructure the post and author information from props
  const { post, author } = props;

  return (
    // Container for a single post
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      {/* User profile picture */}
      <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        {/* User info and post timestamp */}
        <div className="flex gap-1 text-slate-300">
          {/* Link to the user's profile */}
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username} `}</span>
          </Link>
          {/* Link to the post's detailed view and relative timestamp */}
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        {/* Post content */}
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};