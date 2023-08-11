/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Disable eslint rule for unsafe assignments

// Import necessary functions and modules
import { getSearchById } from '../../libs/spotify'; // Importing function to get search results by ID from Spotify API
import { NextApiRequest, NextApiResponse } from 'next'; // Importing types for Next.js API
import { getToken } from 'next-auth/jwt'; // Importing function to retrieve authentication token

// Define the handler function for the API route
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get authentication token from the request
  const token = await getToken({ req });

  // Get the query parameters from the request
  const { query } = req;

  // Check if 'ids' parameter and token are provided in the query parameters
  if (query.ids && token) {
    // Extract 'ids' parameter from query
    const ids = query.ids as string;

    // Extract access token from the authentication token
    const accessToken = token.accessToken as string;

    // Call the getSearchById function to search for tracks by ID on Spotify
    const response = await getSearchById(accessToken, ids);

    // Parse the JSON response and extract 'tracks'
    const { tracks } = await response.json();

    // Return search results (tracks) as JSON response with a success status
    return res.status(200).json(tracks);
  }

  // If 'ids' parameter is not provided or token is missing, return an error response
  return res.status(400).json({ error: "No id provided" });
};

// Export the handler function as the default export
export default handler;
