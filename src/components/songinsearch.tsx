// Disable certain TypeScript rules for specific lines of code
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
import PlusIcon from "./plusicon";
import { motion } from "framer-motion";
import tinycolor from "tinycolor2";
import Player from './player';
import SongImage from "./songimage";
import textColor from "~/libs/textColor";

// Component for displaying a song in search results
export default function SongInSearch({
  song,
  setSong,
  color,
}: {
  song: any;
  setSong: ({
    id,
    name,
    img,
  }: {
    id: string;
    name: string;
    img: string;
  }) => void;
  color: tinycolor.Instance;
}) {
  return (
    // Container for displaying the song in search results
    <motion.div
      initial={{
        x: -20,
        height: "0%",
        backgroundColor: color.toHexString(),
        color: textColor(color, [tinycolor("white")]),
      }}
      animate={{
        x: 0,
        height: "100%",
        backgroundColor: color.clone().lighten(10).toHexString(),
        color: textColor(color.clone().lighten(10), [tinycolor("white")]),
      }}
      whileHover={{ scale: 1.05 }}
      transition={{type: "spring", duration: 0.1}}
      onClick={() =>
        setSong({
          id: song.id,
          name: song.name,
          img: song.album.images[1].url,
        })
      }
      className="m-1 flex w-full flex-row items-center justify-start rounded-2xl px-4 hover:cursor-pointer md:p-2 md:px-8"
      key={song.id}
    >
      {/* Display song image */}
      <div className="rounded-xl aspect-square h-24">
        <SongImage songName={song.name} imgUrl={song.album.images[1].url} spotifyUrl={song.external_urls.spotify} />
      </div>
      
      {/* Display song information */}
      <div className="m-2 flex w-full flex-col items-start justify-center overflow-x-hidden">
        <h1 className="truncate whitespace-nowrap font-semibold md:text-xl">
          {song.name}
        </h1>
        <p className="truncate whitespace-nowrap md:text-xl">
          {song.artists[0].name}
        </p>
      </div>
      
      {/* Display PlusIcon for adding the song */}
      <PlusIcon
        className="h-10 w-10 md:ml-10 cursor-pointer flex justify-center items-center"
        onClick={() =>
          setSong({
            id: song.id,
            name: song.name,
            img: song.album.images[1].url,
          })
        }
      />
    </motion.div>
  );
}
