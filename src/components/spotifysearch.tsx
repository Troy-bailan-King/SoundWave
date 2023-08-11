// Disable certain TypeScript rules for specific lines of code
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import PlusIcon from "./plusicon";
import { motion } from "framer-motion";
import SongInSearch from "./songinsearch";
import tinycolor from "tinycolor2";
import {DebounceInput} from 'react-debounce-input';
import textColor from "~/libs/textColor";

// Component for Spotify song search
export default function SpotifySearch({
  title,
  display,
  color,
  setSong,
}: {
  title: string;
  display: boolean;
  color: tinycolor.Instance;
  setSong: ({
    id,
    name,
    img,
  }: {
    id: string;
    name: string;
    img: string;
  }) => void;
}) {
  // State for search query and search results
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);

  // Function to fetch search results
  const search = (query: string) => {
    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setSearchResults(data));
  };
  
  // Function to handle input change with debounce
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
    search(e.target.value);
  }

  return (
    // Container for the Spotify search component
    <motion.div
      animate={{
        display: display ? "block" : "none",
        x: display ? 0 : -10,
      }}
      style={{
        backgroundColor: color.toHexString(),
        color: textColor(color, [tinycolor("white")]),
      }}
      className="flex h-full w-full flex-col flex-wrap items-center justify-center overflow-x-hidden rounded-b-2xl p-5"
    >
      {/* DebounceInput for the search input */}
      <DebounceInput
        style={{
          backgroundColor: color.clone().lighten(40).toHexString(),
          color: textColor(color.clone().lighten(20), [tinycolor("white")]),
        }}
        debounceTimeout={200}
        value={searchQuery}
        placeholder={"Red (Taylor's Version)"}
        className="my-2 w-full rounded-2xl p-2 text-2xl placeholder-black md:px-4"
        onChange={handleChange}
      />
      <div className="flex w-full flex-col items-center justify-start">
        {/* Render search results */}
        {searchResults &&
          searchResults.map((result: any, idx: number) => (
            <SongInSearch
              color={color}
              key={idx}
              song={result}
              setSong={setSong}
            />
          ))}
      </div>
    </motion.div>
  );
}
