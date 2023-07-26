/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import tinycolor from "tinycolor2";
import { motion } from "framer-motion";
import textColor from "../libs/textColor";
import featuresToColors from "../libs/featuresToColor";
import Login from "../components/login";
import { useSession } from "next-auth/react";
import Player from "../components/player";
import SongCard from "../components/songcard";
import Link from "next/link";
import { handleClientScriptLoad } from "next/script";

function interpolate(features1: any, features2: any, t: number) {
  const features: any = {};
  const s = 1 / (1 + Math.exp(-(5 * (t - 0.5))));
  for (const key in features1) {
    if (features1.hasOwnProperty(key) && typeof features1[key] === "number") {
      features[key] =
        Math.round((features1[key] * (1 - s) + features2[key] * s) * 100) / 100;
    }
  }
  return features;
}

export default function Results() {
  const router = useRouter();
  const { startId, endId } = router.query;
  const { data: session } = useSession();
  const [startSong, setStartSong] = useState<any>(null);
  const [endSong, setEndSong] = useState<any>(null);
  const numSongs = 10;
  const [colors, setColors] = useState<tinycolor.Instance[]>(
    new Array(numSongs + 2).fill(tinycolor("gray"))
  );
  const [interpolatedSongs, setInterpolatedSongs] = useState<any[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const ids = useRef(new Set([startId, endId]));

  useEffect(() => {
    async function fetchSongs() {
      setInterpolatedSongs([]);
      fetch(`/api/search-by-id?ids=${startId},${endId}`)
        .then((res) => res.json())
        .then((data) => {
          setStartSong(data[0]);
          setEndSong(data[1]);
        });
      fetch("/api/audio-features?ids=" + startId + "," + endId)
        .then((res) => res.json())
        .then((data) => {
          if (!data[0]) {
            return null;
          }
          for (let i = 0; i < numSongs; i++) {
            const interpolation = interpolate(
              data[0],
              data[1],
              (i + 1) / numSongs
            );
            interpolation.startId = startId;
            interpolation.endId = endId;

            fetch(
              "/api/recommend-from-interpolation?interpolation=" +
                JSON.stringify(interpolation) +
                "&limit=" +
                String(numSongs + 2)
            )
              .then((res) => res.json())
              .then((data) => {
                if (!data) {
                  return null;
                }
                const filteredData = data.filter((song: any) => {
                  return !ids.current.has(song.id);
                });

                if (filteredData.length === 0) {
                  return;
                }
                ids.current.add(filteredData[0].id);
                const song = filteredData[0];
                song.t = (i + 1) / numSongs;
                setInterpolatedSongs((p: any) =>
                  [...p, song].sort((a, b) => {
                    if (a.t < b.t) {
                      return -1;
                    } else if (b.t < a.t) {
                      return 1;
                    } else {
                      return 0;
                    }
                  })
                );
              });
          }
        });
    }
    fetchSongs();
  }, [endId, startId, numSongs]);

  useEffect(() => {
    if (interpolatedSongs.length === numSongs) {
      fetch(
        "/api/audio-features?ids=" +
          [startId, ...interpolatedSongs.map((s) => s.id), endId].join(",")
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data[0]) {
            return null;
          }
          setColors(data.map((features: any) => featuresToColors(features)));
        });
    }
  }, [interpolatedSongs, startId, endId]);

  function handleCreatePlaylist() {
    fetch(
      `/api/create-playlist?name=${playlistName}&ids=` +
        [startId, ...interpolatedSongs.map((s) => s.id), endId]
          .map((s) => "spotify:track:" + s)
          .join(",") +
        `&description=Vibesition from ${startSong.name} to ${endSong.name}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPlaylistUrl(data.external_urls.spotify);
      });
  }

  if (session) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-start bg-green-50 py-10 pb-20  font-main text-stone-900">
        <div className="m-5 flex flex-row items-center justify-center ">
          <Link href="/">
            <a>
              <img src="/logo.svg" className="mx-3 w-10" />
            </a>
          </Link>
          <h1 className="text-4xl font-semibold">
            <b>
              Your <i>Vibesition</i>
            </b>
          </h1>
        </div>
        <div className="flex w-full flex-row items-center justify-center">
          <div className="flex w-full flex-row flex-wrap items-center justify-center md:w-3/4">
            {(interpolatedSongs &&
              startSong &&
              endSong) ?
              [startSong, ...interpolatedSongs, endSong].map(
                (result: any, idx: number) => (
                  <SongCard
                    song={result}
                    key={idx}
                    color={colors[idx] || tinycolor("#222")}
                  />
                )
              ) : <p> Loading... If it doesn&apos;t load trying refreshing the page</p>}
          </div>
        </div>
        <div className="my-5 flex w-5/6 flex-col rounded-2xl bg-stone-800 p-3 text-xl md:w-1/3 ">
          <div className="flex w-full flex-row items-center justify-between">
            <input
              value={playlistName}
              onChange={(evt) => setPlaylistName(evt.target.value)}
              className="h-1/2  w-3/4 rounded-xl p-2 text-stone-900"
              placeholder="My Vibe Transition"
            ></input>
            <button
              style={{
                backgroundColor: tinycolor("#1ed760")
                  .desaturate(40)
                  .toHexString(),
              }}
              className="mx-3 h-1/2 w-1/2 rounded-xl p-2 text-white"
              onClick={handleCreatePlaylist}
            >
              Save Playlist
            </button>
          </div>
          {playlistUrl && (
            <div className="my-2 flex w-full truncate whitespace-nowrap  text-white hover:text-green-200">
              <img
                className="m-1 aspect-square w-5 origin-center object-contain"
                alt="Spotify Logo"
                src="/spotify.png"
              />
              <a href={playlistUrl}>View Playlist</a>
            </div>
          )}
        </div>

      </div>
    );
  } else {
    return <Login />;
  }
}
