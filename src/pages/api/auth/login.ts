import type { NextApiRequest, NextApiResponse } from "next";

// Function to generate a random string of specified length
const generateRandomString = (length: number): string => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Main function to handle Spotify login
const login = (req: NextApiRequest, res: NextApiResponse) => {
  // Define the requested permissions scope
  const scope = "streaming user-read-email user-read-private";
  // The URL to redirect to after Spotify login
  const spotify_redirect_uri = "http://localhost:3000/api/auth/callback";
  // Generate a random string as a CSRF protection mechanism
  const state: string = generateRandomString(16);

  // Get the Spotify client ID from environment variables
  let spotify_client_id = "";
  if (process.env.SPOTIFY_CLIENT_ID) {
    spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
  } else {
    console.error(
      'Undefined Error: An environmental variable, "SPOTIFY_CLIENT_ID", has something wrong.'
    );
  }

  // Create query parameters for the Spotify authorization URL
  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });

  // Redirect the user to the Spotify authorization URL
  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
};

// Export the login function as the default export
export default login;