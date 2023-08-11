/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Disable eslint rule for unsafe assignments

// Import necessary functions and modules
import { getUsersPlaylists } from '../../libs/spotify'; // Importing function to get user's playlists from Spotify API
import { getSession } from 'next-auth/react'; // Importing function to retrieve session data
import { NextApiRequest, NextApiResponse } from 'next'; // Importing types for Next.js API
import { getToken } from 'next-auth/jwt'; // Importing function to retrieve authentication token

// Define the handler function for the API route
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get authentication token from the request
  const token = await getToken({ req });

  // Check if token is available
  if (token) {
    // Extract access token from the authentication token
    const accessToken = token.accessToken as string;

    // Call the getUsersPlaylists function to fetch user's playlists from Spotify
    const response = await getUsersPlaylists(accessToken);

    // Parse the JSON response and extract 'items' (playlists)
    const { items } = await response.json();

    // Return playlists as JSON response with a success status
    return res.status(200).json({ items });
  }

  // If token is missing, return an empty response
};

// Export the handler function as the default export
export default handler;