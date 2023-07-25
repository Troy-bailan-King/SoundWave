/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @next/next/no-img-element */
import { useSession, signIn, signOut } from "next-auth/react";
import tinycolor from 'tinycolor2';

export default function Login() {
  return (
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center rounded-2xl p-10">
        <button
        style={{backgroundColor:tinycolor("#1ed760").desaturate(40).toHexString()}}
          className="flex h-20 w-3/4 flex-row items-center justify-center rounded-2xl border-white p-4 text-white"
          onClick={() => signIn("spotify")}
        >
          <img
            className="mx-2 brightness-0 invert aspect-square w-14 object-contain"
            alt="Spotify Logo"
            src="/spotify.png"
          />
          <h2 className="w-full text-lg md:text-xl lg:text-2xl"> Link with Spotify</h2>
        </button>
      </div>
  );
}
