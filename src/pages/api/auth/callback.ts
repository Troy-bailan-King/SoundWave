/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize, CookieSerializeOptions } from "cookie";
import axios from "axios";

type SpotifyAuthApiResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

// Function to set an HTTP cookie in the response
export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown
) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  const options: CookieSerializeOptions = {
    httpOnly: true,
    secure: true,
    path: "/",
  };

  res.setHeader("Set-Cookie", serialize(name, stringValue, options));
};

// Callback handler for Spotify authentication
const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  // Extract the authorization code from the query parameters
  const code = req.query.code;
  const spotify_redirect_uri = "http://localhost:3000/api/auth/callback";

  // Retrieve Spotify client ID from environment variable
  let spotify_client_id = "";
  if (process.env.SPOTIFY_CLIENT_ID) {
    spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
  } else {
    console.error(
      'Undefined Error: An environmental variable, "SPOTIFY_CLIENT_ID", is not set.'
    );
  }

  // Retrieve Spotify client secret from environment variable
  let spotify_client_secret = "";
  if (process.env.SPOTIFY_CLIENT_SECRET) {
    spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  } else {
    console.error(
      'Undefined Error: An environmental variable, "SPOTIFY_CLIENT_SECRET", is not set.'
    );
  }

  // Create parameters for token exchange
  const params = new URLSearchParams({
    code: code as string,
    redirect_uri: spotify_redirect_uri,
    grant_type: "authorization_code",
  });

  // Make a POST request to Spotify token endpoint
  axios
    .post<SpotifyAuthApiResponse>(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              spotify_client_id + ":" + spotify_client_secret
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      if (response.data.access_token) {
        // Set the Spotify access token as a cookie
        setCookie(res, "spotify-token", response.data.access_token);
        // Redirect user to the root URL
        res.status(200).redirect("/");
      }
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
    });
};

export default callback;
